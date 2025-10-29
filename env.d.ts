/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'
	type UnknownProps = Record<string, unknown>
	const component: DefineComponent<UnknownProps, UnknownProps, unknown>
	export default component
}
