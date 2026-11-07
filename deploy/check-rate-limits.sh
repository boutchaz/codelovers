#!/usr/bin/env bash
# Runs deploy/nginx.conf in the production nginx image and checks the public rate limits:
# per visitor, not shared by everyone behind the proxy, and not dodged with a forged X-Forwarded-For.
# Needs Docker. Upstream requests fail with 502 (no relay is started); 429 means "rate limited".
set -euo pipefail
cd "$(dirname "$0")/.."
image=nginx:1.27-alpine
net=cl-limits-$$
name=cl-limits-nginx-$$
cleanup() { docker rm -f "$name" >/dev/null 2>&1 || true; docker network rm "$net" >/dev/null 2>&1 || true; }
trap cleanup EXIT
docker network create "$net" >/dev/null
docker run --rm --network "$net" -v "$PWD/deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro" "$image" nginx -t >/dev/null
docker run -d --name "$name" --network "$net" -p 127.0.0.1::80 -v "$PWD/deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro" "$image" >/dev/null
port=$(docker port "$name" 80/tcp | head -1 | sed 's/.*://')
for _ in $(seq 20); do curl -s -o /dev/null "http://127.0.0.1:$port/" && break; sleep 0.5; done

hit() { curl -s -o /dev/null -m 10 -w '%{http_code}' -X POST -H "X-Forwarded-For: $2" "http://127.0.0.1:$port$1"; }
limited() { local count=0; for _ in $(seq "$3"); do [ "$(hit "$1" "$2")" = 429 ] && count=$((count + 1)); done; echo "$count"; }
fail() { echo "FAIL: $*" >&2; exit 1; }

a=203.0.113.10
[ "$(limited /api/inquiry "$a" 12)" -ge 4 ] || fail "a single visitor was not limited on /api/inquiry"
[ "$(hit /api/inquiry 203.0.113.20)" != 429 ] || fail "another visitor was blocked by the first visitor's requests"
[ "$(hit /api/inquiry "198.51.100.77, $a")" = 429 ] || fail "a forged leading X-Forwarded-For entry hid the visitor"
[ "$(hit /api/inquiry "$a, 192.0.2.99")" != 429 ] || fail "a visitor was blamed for an address that is not the last proxy entry"
[ "$(limited /api/newsletter 203.0.113.30 8)" -ge 3 ] || fail "a single visitor was not limited on /api/newsletter"
[ "$(hit /api/newsletter 203.0.113.40)" != 429 ] || fail "another visitor was blocked on /api/newsletter"
echo "rate limits OK"
