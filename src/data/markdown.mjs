import { unified } from "@astrojs/markdown-remark";
import rehypeSanitize from "rehype-sanitize";

// Both publication and draft preview use this pipeline.
export const markdown = {processor: unified({rehypePlugins: [rehypeSanitize]})};
