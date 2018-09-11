import sourceMaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import cjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import replace from 'rollup-plugin-re';
import { uglify } from 'rollup-plugin-uglify';

function getPlugins(isDebug, voiceSuffix) {
    const plugins = [
        nodeResolve({
            jsnext: true,
            browser: true
        }),
        typescript({
            clean: true
        }),
        cjs({
            include: ['node_modules/**']
        }),
        replace({
            include: ['src/index.ts'],
            replaces: {
                'voice.no-rec': 'voice.' + voiceSuffix
            }
        })
    ];
    if (isDebug) {
        plugins.unshift(sourceMaps());
    } else {
        plugins.push(uglify({
            compress: {},
            mangle: {
                properties: {
                    regex: /^_[^_]/
                }
            },
            ie8: false,
            warnings: true
        }));
    }
    return plugins;
}

const voiceSuffixList = [
    'no-rec',
    'mp3+wechat',
    'amr+wechat',
    'mp3',
    'wechat'
];

const config = [ 
    {
        input: 'src/index.ts',
        plugins: getPlugins(true, 'mp3+wechat'),
        output: [
            {
                name: 'yim',
                file: 'yim.js',
                format: 'umd',
                strict: false,
                sourcemap: true
            }
        ]
    },
    {
        input: 'src/index.ts',
        plugins: getPlugins(false, 'mp3+wechat'),
        output: [
            {
                name: 'yim',
                file: 'yim.min.js',
                format: 'umd',
                strict: false,
                sourcemap: false
            }
        ]
    }
];

for (let suf of voiceSuffixList) {
    config.push({
        input: 'src/index.ts',
        plugins: getPlugins(true, suf),
        output: [
            {
                name: 'yim',
                file: 'dist/yim.' + suf + '.js',
                format: 'umd',
                strict: false,
                sourcemap: true
            }
        ]
    }, {
        input: 'src/index.ts',
        plugins: getPlugins(false, suf),
        output: [
            {
                name: 'yim',
                file: 'dist/yim.' + suf + '.min.js',
                format: 'umd',
                strict: false,
                sourcemap: false
            }
        ]
    });
}

export default config;
