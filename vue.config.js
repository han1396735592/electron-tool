const path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}

module.exports = {

    // pages: {
    //     // index: {
    //     //     // page 的入口
    //     //     entry: 'src/main.js',
    //     //     // 模板来源
    //     //     template: 'public/login.html',
    //     //     // 在 dist/index.html 的输出
    //     //     filename: 'login.html',
    //     //     // 当使用 title 选项时，
    //     //     // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    //     //     title: '登录',
    //     //     // 在这个页面中包含的块，默认情况下会包含
    //     //     // 提取出来的通用 chunk 和 vendor chunk。
    //     //     chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     // },
    //     config: {
    //         entry: 'src/config/main.js',
    //         // 模板来源
    //         template: 'public/config.html',
    //         // 在 dist/index.html 的输出
    //         filename: 'config.html',
    //         // 当使用 title 选项时，
    //         // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
    //         title: '系统配置',
    //         // 在这个页面中包含的块，默认情况下会包含
    //         // 提取出来的通用 chunk 和 vendor chunk。
    //         // chunks: ['chunk-vendors', 'chunk-common', 'index']
    //     },
    // },

    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                appId: "cn.qqhxj.electron-tool",
                productName: "electron-tool",
                copyright: "Copyright © 2021 han1396735592",
                publish: [
                    {
                        provider: "generic",
                        url: "http://electron-tool.qqhxj.cn/download/releases" //更新服务器地址,可为空
                    }
                ],
                "electronDownload": {
                    "mirror": "https://npm.taobao.org/mirrors/electron/"
                },
                win: {
                    icon: "./build/icons/icon.ico",//图标，当前图标在根目录下，注意这里有两个坑
                    target: [
                        {
                            target: "nsis",//利用nsis制作安装程序
                            arch: [
                                "x64",//64位
                            ]
                        }
                    ]
                },
                "mac": {
                    "icon": "build/icons/icon.icns"
                },
                "extraResources": [
                    {
                        "from": "lib/",
                        "to": "lib/"
                    }]
            },
            nodeIntegration: true,
            preload: 'src/preload.js',
            // List native deps here if they don't work
            externals: ['serialport'],
            // If you are using Yarn Workspaces, you may have multiple node_modules folders
            // List them all here so that VCP Electron Builder can find them
            nodeModulesPath: ['../../node_modules', './node_modules']
        }
    },
    productionSourceMap: false,

    chainWebpack: (config) => {
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@api', resolve('src/api'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@views', resolve('src/views'))
            .set('@layout', resolve('src/layout'))
            .set('config', resolve('config'))
            .set('@', resolve('src'))
            .set('@core', resolve('src/core'))
            .set('@utils', resolve('src/utils'))
            .set('@entry', resolve('src/entry'))
            .set('@router', resolve('src/router'))
            .set('@store', resolve('src/store'))

        // 配置 webpack 识别 markdown 为普通的文件
        config.module
            .rule('markdown')
            .test(/\.md$/)
            .use()
            .loader('file-loader')
            .end()


        // if (process.env.NODE_ENV === 'production') {
        //   config.set('externals', externals)
        // }
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    /* less 变量覆盖，用于自定义 ant design 主题 */
                    'primary-color': '#1890FF',
                    'link-color': '#1890FF',
                    'border-radius-base': '4px'
                },
                javascriptEnabled: true
            }
        }
    },

    devServer: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://192.168.31.121:9999/', // 请求本地 需要jeecg-boot后台项目
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/file': {
                target: 'http://127.0.0.1:80/', // 请求本地 需要jeecg-boot后台项目
                ws: false,
                changeOrigin: true
                // pathRewrite: {
                //   '^/api': ''
                // }
            }
        },
        disableHostCheck: true
    },
    runtimeCompiler: true,
    lintOnSave: undefined,
}
