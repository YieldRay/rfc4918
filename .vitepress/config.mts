import { defineConfig } from "vitepress";
import { pagefindPlugin } from "vitepress-plugin-pagefind";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "RFC4918",
  description: "中文翻译",
  lang: "zh-cn",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: "Home", link: "/" }],
    sidebar: [
      {
        text: "Table of Contents",
        items: [
          { text: "00-扉页及目录", link: "/00-扉页及目录" },
          { text: "01-概述", link: "/01-概述" },
          { text: "02-符号公约", link: "/02-符号公约" },
          { text: "03-术语", link: "/03-术语" },
          { text: "04-资源属性的数据模型", link: "/04-资源属性的数据模型" },
          { text: "05-网络资源集合", link: "/05-网络资源集合" },
          { text: "06-锁定", link: "/06-锁定" },
          { text: "07-写入锁", link: "/07-写入锁" },
          { text: "08-一般请求和响应处理", link: "/08-一般请求和响应处理" },
          { text: "09-WebDAV的HTTP方法", link: "/09-WebDAV的HTTP方法" },
          { text: "10-WebDAV的HTTP报头", link: "/10-WebDAV的HTTP报头" },
          { text: "11-HTTP1.1的状态码扩展", link: "/11-HTTP1.1的状态码扩展" },
          { text: "12-HTTP状态码的使用", link: "/12-HTTP状态码的使用" },
          { text: "13-多状态响应", link: "/13-多状态响应" },
          { text: "14-XML元素定义", link: "/14-XML元素定义" },
          { text: "15-DAV属性", link: "/15-DAV属性" },
          { text: "16-前置&后置条件XML元素", link: "/16-前置&后置条件XML元素" },
          { text: "17-DAV中的XML可扩展性", link: "/17-DAV中的XML可扩展性" },
          { text: "18-DAV兼容级别", link: "/18-DAV兼容级别" },
          { text: "19-国际化注意事项", link: "/19-国际化注意事项" },
          { text: "20-安全性考量", link: "/20-安全性考量" },
          { text: "21-IANA相关事项", link: "/21-IANA相关事项" },
          { text: "22-致谢", link: "/22-致谢" },
          { text: "23-本规范的贡献者", link: "/23-本规范的贡献者" },
          { text: "24-RFC2518的作者", link: "/24-RFC2518的作者" },
          { text: "25-参考文献", link: "/25-参考文献" },
          { text: "其它信息", link: "/其它信息" },
          { text: "字符序索引", link: "/字符序索引" },
          { text: "附录A-处理XML的注意事项", link: "/附录A-处理XML的注意事项" },
          { text: "附录B-HTTP客户端兼容性", link: "/附录B-HTTP客户端兼容性" },
          {
            text: "附录C-“opaquelocktoken”方案和URI",
            link: "/附录C-“opaquelocktoken”方案和URI",
          },
          { text: "附录D-[Lock-Null]资源", link: "/附录D-[Lock-Null]资源" },
          { text: "附录E-客户认证激活指南", link: "/附录E-客户认证激活指南" },
          {
            text: "附录F-相比RFC2518的主要变更",
            link: "/附录F-相比RFC2518的主要变更",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/riife/rfc4918' }
    ],
  },
  vite: {
    plugins: [
      // https://github.com/emersonbottero/vitepress-plugin-search
      pagefindPlugin({
        forceLanguage: "zh-cn",
        btnPlaceholder: "搜索",
        placeholder: "搜索文档",
        emptyText: "空空如也",
        heading: "共: {{searchResult}} 条结果",
        customSearchQuery(input) {
          // 将搜索的每个中文单字两侧加上空格
          return input
            .replace(/[\u4E00-\u9FA5]/g, " $& ")
            .replace(/\s+/g, " ")
            .trim();
        },
      }),
    ],
  },
});
