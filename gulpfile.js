'use strict';
// 引入 gulp
var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    del = require('del'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    argv = require('yargs').argv,
    Gpkg = require('./abc.json'),
    $ = gulpLoadPlugins();
gulpLoadPlugins({
    rename: {
        'gulp-minify-css': 'minifyCss',
        'gulp-rev-collector': 'revCollector'
    }
});
var imgBase = Gpkg.imgBase;
var VERSION = Gpkg.version;
var evr = argv.d || !argv.p; //生产环境为false，开发环境为true，默认为true
var isRoot=!evr?'/active':'';  //是否替换根目录
/* 环境信息 */
var pathConfig =Gpkg.pathConfig;
var srcZip = 'dist/**/' + argv.name + '/**',
    bidZip = 'build/active',
    dstZip = 'zip/';

gulp.task('all', function() {
    return gulp.src(pathConfig.all)
        .pipe(gulp.dest(pathConfig.dst));
});

// 压缩html
gulp.task('html', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    return gulp.src(pathConfig.html)
        .pipe($.fileInclude())
        .pipe($.replace(/@@ROOT/gi, isRoot))
        .pipe($.if(!evr, $.htmlmin(options)))
        .pipe(gulp.dest(pathConfig.dst));
});

//重命名css、js并修改html引入名称
gulp.task('min', function() {
    // gulp.src([pathConfig.dst + '/**/*.css', '!' + pathConfig.dst + '/widgets/**'])
    //     .pipe($.if(!evr, $.rename({
    //         suffix: ".min"
    //     })))
    //     .pipe(gulp.dest(pathConfig.dst));
    gulp.src([pathConfig.dst + '/common/*.js', '!' + pathConfig.dst + '/widgets/**'])
        .pipe($.if(!evr, $.rename({
            suffix: ".min"
        })))
        .pipe(gulp.dest(pathConfig.dst+'/common'));

    //延迟替换，受rev的影响
    setTimeout(function() {
        gulp.start('replace');
    }, 5000);
});

//重命名静态文件
gulp.task('replace', function() {
    return gulp.src(pathConfig.dst + '/act/**/*.html')
        // .pipe($.if(!evr, $.replace(/[.]css/g, ".min.css")))
        .pipe($.replace(/@@ROOT/gi, isRoot))
        .pipe($.if(!evr, $.replace(!/widgets/gi+/[.]js/g, '.min.js')))
        .pipe($.if(!evr, $.replace('hm.min.js', 'hm.js')))
        .pipe($.if(!evr, $.replace('jweixin-1.0.0.min.js', 'jweixin-1.0.0.js')))
        .pipe(gulp.dest(pathConfig.dst+'/act'));

});

// 压缩图片
gulp.task('img', function() {
   /* gulp.src(pathConfig.img)
    .pipe(gulp.dest(pathConfig.dst));*/

    return gulp.src(pathConfig.img)
        .pipe($.if(!evr, $.rev()))
        .pipe(gulp.dest(pathConfig.dst))
        .pipe($.if(!evr, $.rev.manifest()))
        .pipe($.if(!evr, gulp.dest(pathConfig.revImg)));
});
//处理JSON文件
gulp.task('json',function(){
     return gulp.src(pathConfig.json)
        .pipe($.replace(/@@ROOT/gi, isRoot))
        .pipe($.if(!evr, $.rev()))
        .pipe(gulp.dest(pathConfig.dst))
        .pipe($.if(!evr, $.rev.manifest()))
        .pipe($.if(!evr, gulp.dest(pathConfig.revJson)));
});
//编译less
gulp.task('less', function() {
    return gulp.src([pathConfig.less, '!app/widgets/**'])
        .pipe($.sourcemaps.init())
        .pipe($.plumber({
            errorHandler: $.notify.onError('Error: <%= error.message %>')
        }))
        .pipe($.less())
        .pipe($.if(!evr, $.minifyCss()))
        .pipe($.sourcemaps.write())
        .pipe($.replace(/@@ROOT/gi, isRoot))
        .pipe($.if(!evr, $.rev()))
        .pipe(gulp.dest(pathConfig.dst))
        .pipe($.if(!evr, $.rev.manifest()))
        .pipe($.if(!evr, gulp.dest(pathConfig.revCss)));
});

// 检查js
gulp.task('lint', function() {
    return gulp.src(pathConfig.script)
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'));

});

//压缩js
gulp.task('script', function() {
    gulp.src('app/common/**')
        .pipe($.if(!evr, $.uglify()))
        .pipe(gulp.dest('dist/common/'));
    gulp.src('app/widgets/**')
        .pipe(gulp.dest('dist/widgets/'));

    return gulp.src([pathConfig.script, '!app/common/**', '!app/widgets/**'])
        .pipe($.replace(/@@ROOT/gi, isRoot))
        .pipe($.if(!evr, $.uglify()))
        .pipe($.if(!evr, $.rev()))
        .pipe(gulp.dest(pathConfig.dst))
        .pipe($.if(!evr, $.rev.manifest()))
        .pipe($.if(!evr, gulp.dest(pathConfig.revScript)));

});

//加md5戳
gulp.task('rev', function() {
    gulp.src(['rev/**/*.json', pathConfig.dstAll, '!' + pathConfig.dst + '/**/*.{png,jpg,jpeg,gif,ico,webp,svg}']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe($.revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(pathConfig.dst)); //- 替换后的文件输出的目录

        //延迟替换，受rev的影响
    setTimeout(function() {
        gulp.start('min');
    }, 1000);
});
//copy其他文件
gulp.task('otherfile',function(){
    return gulp.src(pathConfig.ofile)
        .pipe(gulp.dest(pathConfig.dst));
});

//打包前处理
gulp.task('zipclean',function(){
   return del([pathConfig.bid]);   
});
gulp.task('zipcopy',function(){
   return gulp.src(srcZip)
        .pipe(gulp.dest(bidZip));
});
//打成zip包
gulp.task('zip', function() {
    function checkTime(i) {
          if (i < 10) {
              i = "0" + i
          }
          return i;
      }
      var d=new Date();
      var year=d.getFullYear();
      var month=checkTime(d.getMonth() + 1);
      var day=checkTime(d.getDate());
      var hour=checkTime(d.getHours());
      var minute=checkTime(d.getMinutes());
    return gulp.src('build/**')
        .pipe($.zip( Gpkg.name+'_'+argv.name+'_'+year+month+day+hour+minute +'_'+VERSION+'.zip'))
        .pipe(gulp.dest(dstZip));
});
//清空输出文件
gulp.task('clean', function() {
    return del([pathConfig.dst, pathConfig.rev]);
});

//命令帮助
gulp.task('help', function() {
    console.log('	gulp help			gulp参数说明');
    console.log('	gulp serve			测试serve');
    console.log('	gulp build			文件打包 (开发环境)');
    console.log('	gulp build -p		文件打包 (生产环境)');
    console.log('   gulp zipbuild --name XXXX       快速打zip包 (生产环境)');
});

//监控改动并自动刷新任务;
//命令行使用gulp auto启动;
gulp.task('auto', function() {
    gulp.watch(pathConfig.less, ['less']);
    gulp.watch(pathConfig.script, ['script', 'html']);
    gulp.watch(pathConfig.img, ['img']);
    gulp.watch(pathConfig.html, ['html']);
    gulp.watch(pathConfig.all).on('change', function() {
        // browserSync.reload();
        setTimeout(function() {
            browserSync.reload();
        }, 3500);
    });
});

//服务器任务:以dist文件夹为基础,启动服务器;
//命令行使用gulp server启用此任务;
gulp.task('browser-sync', function() {
    browserSync.init({
        server: pathConfig.dst,
        open:false
    });
});

//打包并启动本地服务器
gulp.task('serve', $.sequence('clean', 'help','otherfile', 'less', 'img', ['script', 'html'], 'browser-sync', 'auto'));

//打包
gulp.task('build', $.sequence('clean', 'less','otherfile', 'img','json', ['script', 'html'],'rev', 'browser-sync'));

//快速打zip包
gulp.task('zipbuild', $.sequence('zipclean','zipcopy','zip'));

