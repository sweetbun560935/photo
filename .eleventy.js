require('dotenv').config();
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
    // Folders to copy to build dir (See. 1.1)
    eleventyConfig.addPassthroughCopy("src/static");

    if (process.env.ELEVENTY_ENV === 'production') {
        // Minify HTML (including inlined CSS and JS) 
        eleventyConfig.addTransform("compressHTML", function (content, outputPath) {
            if (outputPath.endsWith(".html")) {
                let minified = htmlmin.minify(content, {
                    useShortDoctype: true,
                    removeComments: true,
                    collapseWhitespace: true,
                    minifyCSS: true,
                    minifyJS: true
                });
                return minified;
            }
            return content;
        });
    }
    
    // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
    eleventyConfig.addFilter('htmlDateString', (dateObj) => {
        return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
    });

    eleventyConfig.addFilter("readableDate", dateObj => {
        return DateTime.fromJSDate(new Date(dateObj), { zone: 'utc' }).toFormat("dd LLL yyyy");
    });

    eleventyConfig.addFilter("w3cDate", function (date) {
        return date.toISOString();
    });

    eleventyConfig.addFilter("classify", function(data) {
        return data.replace(/\W/g, '');
    })

    eleventyConfig.addFilter("replaceDoubleQuote", (value) => value.replace(`"`, `'`));
    eleventyConfig.addFilter("replaceSingleQuote", (value) => value.replace(`'`, `"`));
    
    eleventyConfig.addPlugin(eleventyNavigationPlugin);

    return {
        dir: {
            input: "src/",
            output: "dist",
            includes: "_includes"
        },
        templateFormats: ["html", "md", "njk", "11ty.js"],
        htmlTemplateEngine: "njk",

        // 1.1 Enable elventy to pass dirs specified above
        passthroughFileCopy: true
    };
};
