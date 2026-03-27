import gulp from 'gulp'
const { dest, series, src } = gulp
import gulpSass from 'gulp-sass'
import * as sass from 'sass'
import autoprefixer from "gulp-autoprefixer";
import del from 'del'
import merge from 'gulp-merge-json'

var brand = 'bankofscotland';

var paths = {
    src: {
        common_css: './TempFiles/common/sass/**/*.+(scss|sass)',
        common_font_icons: './TempFiles/common/fonts/core-icons/*',
        brand_font_icons: `./TempFiles/${brand}/fonts/brand-icons/*`,
        brand_fonts: `./TempFiles/${brand}/fonts/**/*`,
        brand_images: `./TempFiles/${brand}/images/**/*.+(png|svg|jpg|gif|ico)`,
        brand_sass: `./TempFiles/${brand}/sass/**/*.+(scss|sass)`,
        components_api: './TempFiles/Api/**/*.json',
        ping: `./TempFiles/${brand}/ping/*.js`,
        ping_images: [`./TempFiles/${brand}/images/logo-brand--alt.svg`, `./TempFiles/${brand}/images/icon-houston-avatar.svg`, `./TempFiles/${brand}/images/webchat/need_help_on.gif`]
    },
    dest: {
        css: './wwwroot/dist/css',
        fonts: './wwwroot/dist/fonts',
        font_icons: './wwwroot/dist/fonts/core-icons',
        brand_icons: './wwwroot/dist/fonts/brand-icons',
        images: './wwwroot/dist/images',
        root_dir: './wwwroot/dist/',
        ping: './wwwroot/dist/ping',
        ping_images: './wwwroot/dist/ping/images'
    }
};

function clean() {
    return del([paths.dest.root_dir],
        {
            force: true
        });
}

function images() {
    return src([paths.src.brand_images])
        .pipe(dest(paths.dest.images));
}

function fonts() {
    return src([paths.src.brand_fonts])
        .pipe(dest(paths.dest.fonts));
}

function fontIcons() {
    return src([paths.src.common_font_icons])
        .pipe(dest(paths.dest.font_icons));
}

function brandIcons() {
    return src([paths.src.brand_font_icons])
        .pipe(dest(paths.dest.brand_icons));
}

function ping() {
    return src([paths.src.ping])
        .pipe(dest(paths.dest.ping));
}

function pingImages() {
    return src(paths.src.ping_images)
        .pipe(dest(paths.dest.ping_images));
}

function apis() {
    return src([paths.src.components_api])
        .pipe(merge({
            fileName: 'api.json',
            edit: (parsedJson, file) => {
                Object.keys(parsedJson).forEach((value, idx) => {
                    if (parsedJson[value].hasOwnProperty('testcase')) {
                        delete parsedJson[value].testcase;
                    }
                });

                return parsedJson;
            }
        })).pipe(dest('./'));
}

function compileSass() {
    const gulpSassCompiler = gulpSass(sass);
    
    return src(paths.src.brand_sass)
        .pipe(gulpSassCompiler({ outputStyle: "compressed" }).on("error", gulpSassCompiler.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest(paths.dest.css));
}

function copyProjectViews(projectFolder) {
    return gulp
        .src([`${projectFolder}Views/**/*.cshtml`])
        .pipe(dest('./views/shared/'));
}

function copyProjectScripts(projectFolder) {
    return gulp
        .src([`${projectFolder}Scripts/*.js`])
        .pipe(dest('./TempFiles/components/scripts'));
}

function copyProjectApiJson(projectFolder, componentName) {
    return gulp
        .src([`${projectFolder}api.json`])
        .pipe(dest(`./TempFiles/Api/${componentName}`));
}

function debugComponent(componentName) {
    const componentPath = '../../../../web-lib-components/src/';
    const projectFolder = `${componentPath}BGLi.Components.${componentName}/BGLi.Components.${componentName}/`;

    copyProjectViews(projectFolder);
    console.log(`copied views from ${componentName}`);

    copyProjectScripts(projectFolder)
    console.log(`copied scripts from ${componentName}`);

    copyProjectApiJson(projectFolder, componentName)
    console.log(`copied api.json from ${componentName}`);

    return Promise.resolve('Completed Setup');
}

export const debugAdditionalDetails = () => debugComponent('AdditionalDetails');
export const debugBasket = () => debugComponent('Basket');
export const debugContactDetails = () => debugComponent('ContactDetails');
export const debugCoverDetails = () => debugComponent('CoverDetails');
export const debugCoverRange = () => debugComponent('CoverRange');
export const debugDemandsAndNeeds = () => debugComponent('DemandsAndNeeds');
export const debugDriverDetails = () => debugComponent('DriverDetails');
export const debugFooter = () => debugComponent('Footer');
export const debugGoogleTagManager = () => debugComponent('GoogleTagManager');
export const debugHouston = () => debugComponent('Houston');
export const debugMarketingPreferences = () => debugComponent('MarketingPreferences');
export const debugNavigation = () => debugComponent('Navigation');
export const debugOptionalExtras = () => debugComponent('OptionalExtras');
export const debugPageReloader = () => debugComponent('PageReloader');
export const debugTakePayment = () => debugComponent('TakePayment');
export const debugTermsAndConditions = () => debugComponent('TermsAndConds');
export const debugVehicleDetails = () => debugComponent('VehicleDetail');
export const debugVirtualAssistant = () => debugComponent('VirtualAssistant');
export const debugWelcomeQuote = () => debugComponent('WelcomeQuote');

export const build = () => {
    series(
    clean, 
    images, 
    fonts, 
    fontIcons, 
    brandIcons,
    apis, 
    compileSass, 
    ping, 
    pingImages)();

    return Promise.resolve('Completed build');
} 