import svelte from 'rollup-plugin-svelte'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import {terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript'
import json from '@rollup/plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import css from 'rollup-plugin-css-only'
import replace from '@rollup/plugin-replace'

const production = !process.env.ROLLUP_WATCH
let endPoints = {
    rest: "http://0.0.0.0:8080",
    webSocket: "ws://0.0.0.0:8080"
}
if(process.env.stage === 'prod'){
    endPoints = {
        rest: "https://sudoku-scratchoff-server.herokuapp.com",
        webSocket: "wss://sudoku-scratchoff-server.herokuapp.com"
    }
}

export default {
    input: 'src/main.js',
    output: {
        sourcemap: true,
        format: 'iife',
        name: 'app',
        file: 'public/build/bundle.js'
    },
    plugins: [
        svelte({
            // enable run-time checks when not in production
            dev: !production,
            // we'll extract any component CSS out into
            // a separate file - better for performance
            css: css => {
                css.write('public/build/bundle.css')
            }
        }),

        // If you have external dependencies installed from
        // npm, you'll most likely need these plugins. In
        // some cases you'll need additional configuration -
        // consult the documentation for details:
        // https://github.com/rollup/plugins/tree/master/packages/commonjs
        resolve({
            browser: true,
            dedupe: ['svelte']
        }),
        commonjs(),

        // In dev mode, call `npm run start` once
        // the bundle has been generated
        !production && serve(),

        // Watch the `public` directory and refresh the
        // browser on changes when not in production
        !production && livereload('public'),

        // If we're building for production (npm run build
        // instead of npm run dev), minify
        production && terser(),
        typescript(),
        json(),
        builtins(),
        css({output: 'public/build/extra.css'}),
        replace({
            __REST_ENDPOINT__: endPoints.rest,
            __WEBSOCKET_ENDPOINT__: endPoints.webSocket
        })
    ],
    watch: {
        clearScreen: false
    }
}

function serve() {
    let started = false

    return {
        writeBundle() {
            if (!started) {
                started = true

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                })
            }
        }
    }
}
