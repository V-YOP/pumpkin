# pumpkin
A gallery website generator

项目分为两个部分——控制台工具，前端网页。

前端负责根据 json 文件进行内容展示，控制台工具负责根据图片文件夹生成数据 json 文件，以及生成该 json 的 ts 类型定义，以及生成一个默认的前端。

项目根目录存放控制台工具，website路径下存放前端，使用webpack打包（之后考虑分离到其它项目？没什么必要吧）。