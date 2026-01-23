import imagemin from 'imagemin'
import imageminWebp from 'imagemin-webp'
import path from 'path'
import { defineConfig } from 'vite'
import glob from 'fast-glob'
import { fileURLToPath } from 'url'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import handlebars from 'vite-plugin-handlebars'
import FullReload from 'vite-plugin-full-reload'

// you can use our path for your project
const rootPath = './'
// example: const rootPath = '/my-path/'

export default defineConfig({


	plugins: [

		handlebars({
			partialDirectory: path.resolve(__dirname, 'src/partials'), // папка с header/footer/js
			context: {
				siteTitle: 'Мой проект'
			},
			extensions: ['.html'],
		}),

		FullReload(['src/partials/**/*.html']),

		// ViteImageOptimizer({
		// 	svg: {
		// 		plugins: [
		// 			'removeDoctype',
		// 			'removeXMLProcInst',
		// 			'minifyStyles',
		// 			'sortAttrs',
		// 			'sortDefsChildren',
		// 		],
		// 	},
		// 	png: {
		// 		quality: 70,
		// 	},
		// 	jpeg: {
		// 		quality: 70,
		// 	},
		// 	jpg: {
		// 		quality: 70,
		// 	}
		// }),
		// {
		// 	...imagemin(['./src/img/**/*.{jpg,png,jpeg}'], {
		// 		destination: './src/img/webp/',
		// 		plugins: [
		// 			imageminWebp({ quality: 70 })
		// 		]
		// 	}),
		// 	apply: 'serve',
		// }
	],
	server: {
		watch: {
			// заставляем Vite следить за изменениями в partials
			ignored: [],
		},
	},



	build: {
		cssCodeSplit: true,
		rollupOptions: {
			input: Object.fromEntries(
				glob.sync(['./*.html', './pages/**/*.html']).map(file => [
					path.relative(__dirname, file.slice(0, file.length - path.extname(file).length)),
					fileURLToPath(new URL(file, import.meta.url))
				])
			),

			output: {
				entryFileNames: 'assets/js/[name].[hash].js',
				chunkFileNames: 'assets/js/[name].[hash].js',
				assetFileNames: assetInfo => {
					const ext = path.extname(assetInfo.name).toLowerCase()
					if (ext === '.css') return 'assets/style/[name].[hash][extname]'
					if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) return 'assets/fonts/[name].[hash][extname]'
					if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) return 'assets/image/[name].[hash][extname]'
					return 'assets/[name].[hash][extname]'
				}
			}

		},
	},
	base: `${rootPath}`,
})