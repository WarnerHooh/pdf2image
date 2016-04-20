// generated on 2016-01-11 using generator-gulp-webapp 1.0.4
import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import sass from 'gulp-sass';
import babelify from 'babelify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('src/styles/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('public/stylesheets'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint({useEslintrc: true}))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  };
}

//gulp.task('lint', lint('src/scripts/**/*.js'));
//gulp.task('lint:test', lint('test/spec/**/*.js'));

gulp.task('html', ['styles'], () => {
  return gulp.src('app/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'app', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin()))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe($.if($.if.isFile, $.cache($.imagemin({
        progressive: true,
        interlaced: true,
        // don't remove IDs from SVGs, they are often used
        // as hooks for embedding and styling
        svgoPlugins: [{cleanupIDs: false}]
      }))
      .on('error', function (err) {
        console.log(err);
        this.end();
      })))
    .pipe(gulp.dest('public/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('src/fonts/**/*'))
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('extras', () => {
  return gulp.src([
      'src/*.*',
      '!src/*.html'
    ], {
      dot: true
    })
    .pipe(gulp.dest('dist'));
});

gulp.task('scripts', () => {
  return browserify('src/scripts/main.js')
    .transform(babelify, {presets: ["es2015", "stage-0"]})
    .bundle()
    .pipe(source('javascripts/main.js'))
    .pipe(gulp.dest('public'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', ['styles', 'scripts', 'fonts'], () => {
  //browserSync({
  //  notify: false,
  //  port: 9000,
  //  server: {
  //    baseDir: ['.tmp', 'app'],
  //    index: 'homework2.html',
  //    routes: {
  //      '/node_modules': 'node_modules'
  //    }
  //  }
  //});

  gulp.watch([
    'src/*.html',
    'src/scripts/*.js',
    'src/images/**/*'
  ]).on('change', reload);

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
});

gulp.task('serve:dist', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dist'],
      index: "homework2.html"
    }
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/scripts': 'app/scripts',
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});


gulp.task('build', ['html','images', 'extras', 'compile'], () => {  // 'lint',
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
