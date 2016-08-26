# Environment
准备：
1.Git-1.9.5-preview20150319或以上
2.node-v4.4.5-x64或以上
备注：下载地址：git https://git-scm.com/download
              node https://nodejs.org/en/

安装：
先安装nodejs 直接点击下载下来的msi文件，一路默认安装.
检测：打开nodejs命令行窗口(开始--》Node.js--》第一个命令) node -v ,npm -v 查看安装版本

然后安装git工具，一路默认安装.

命令安装：
1.打开nodejs命令行窗口，使用下边命令安装npm,若node自带npm可忽略
node cli.js install npm
检测版本：npm -v 查看安装版本

2.SVN项目下载
https://192.168.10.245:800/svn/03Mobile/01Code/src/live1

3.定位到项目，安装gulp
cd，定位到目录
ls，列出文件列表
(建议多敲敲这两个命令，了解文件系统并知道文件都在哪里。)

例如：我的项目在d盘，打开git工具执行：cd d:live1
然后执行 sudo npm install -g gulp
I.sudo是以管理员身份执行命令，一般会要求输入电脑密码(也可以不加sudo)
II.npm是安装node模块的工具，执行install命令
III.-g表示在全局环境安装，以便任何项目都能使用它
IV.最后，gulp是将要安装的node模块的名字
V.执行gulp -v 检查是否安装成功

4.安装gulp相关插件
打开git工具执行 npm install（若安装插件的过程中出现error，建议再次执行npm install 命令.正常网络且设置镜像安装大概需要10min。设置淘宝镜像会快很多，具体请看最下方.）
安装过程时会在项目中产生一个node_modules文件夹
（切记）这个文件夹不用上传到SVN。

5.代码安装检测
gulp serve 等待运行完成（5s左右）

6.查看效果
http://localhost:3000/index.html

## Build & development

运行项目使用gulp命令
 'gulp serve' 本地调试
 'gulp build' 打包命令
 'gulp clean' 清空dist文件
 'gulp help'	gulp参数说明
 'gulp -p'		生产环境 参数均可在各个命令后面加，如：'gulp build -p'
 'gulp -d'		开发环境（默认开发环境）
 'gulp zipbuild --name XXXX '      快速打zip包 例如: gulp zipbuild --name guess


##  代码结构
app ---主目录

app--act  --->活动主目录
app--common  -->本地公共js目录
app--template  -->公共模版目录
app--widgets   -->公共外部JS库文件
app--common.less  -->公共CSS文件
app--index.html 首页
app--act/....各活动页面不解释

node_modules  ---gulp 插件目录（不要上传SVN）
rev ---临时文件夹（不要上传SVN）
build,zip  ---快速打zip包目录 （不要上传SVN）

dist---本地调式目录，也是上线目录

abc.json,package.json，gulpfile.js（配置文件，尽量少动）

## Html模板引入
创建一个html文件,引入另一个文件。
如a.html,b.html两个文件
把a.html 以模板形式插入b.html
只需在b.html的dom中加入@@include("a.html") include与括号之间不能有空格,后面不能有;
最后执行'gulp serve',查看效果。

静态资源文件（js\css\img等）
记得都要写   全   路    径    ~
(可参考/act/dailyGuess写法)


## npm淘宝镜像设置
找到node安装目录,然后进目录node\node_modules\npm\npmrc
找到npmrc这个文件,在文件内容加上
registry = http://registry.npm.taobao.org
这样就设置成功了，restart一下就可以了。

###v1.1.0###
新增根目录配置，在引用静态资源的时候，需要加上@@ROOT，根目录配置，相关命令不变。
例如：@@ROOT/act/dailyGuess/index.css 
