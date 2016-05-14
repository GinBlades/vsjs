/// <binding BeforeBuild='build' />
var gulp = require("gulp"),
    plumber = require("gulp-plumber"),
    sourceMaps = require("gulp-sourcemaps"),
    ts = require("gulp-typescript"),
    tsLint = require("gulp-tslint"),
    concat = require("gulp-concat");


gulp.task('tsc-server', () => {
    return gulp.src("source/server/**/*.ts")
        .pipe(plumber())
        .pipe(tsLint({ configuration: "source/server/tslint.json" }))
        .pipe(tsLint.report("prose", { emitError: false }))
		.pipe(ts({
        module: "commonjs"
    }))
		.pipe(gulp.dest('./build/server'));
});

gulp.task('tsc-client', () => {
    return gulp.src("source/client/**/*.ts")
        .pipe(plumber())
        .pipe(tsLint())
        .pipe(tsLint.report("prose", { emitError: false }))
        .pipe(sourceMaps.init())
		.pipe(ts())
        .pipe(concat("main.js"))
        .pipe(sourceMaps.write("."))
		.pipe(gulp.dest('./build/client/js'));
});

gulp.task("tsc", ["tsc-client", "tsc-server"]);

gulp.task("copyViews", () => {
    return gulp.src("source/server/views/**/*.jade")
        .pipe(gulp.dest("./build/server/views"));
});

gulp.task("watch", () => {
    gulp.watch("./source/server/**/*.ts", ["tsc-server"]);
    gulp.watch("./source/client/**/*.ts", ["tsc-client"]);
    gulp.watch("./source/server/views/**/*.jade", ["copyViews"]);
});

gulp.task("build", ["tsc", "copyViews"]);

gulp.task("default", ["watch", "build"]);