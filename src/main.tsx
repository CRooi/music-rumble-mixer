import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@elastic/eui/dist/eui_theme_light.css'
import '@elastic/eui/dist/eui_theme_dark.css'  // 你需要引入dark模式的css
import { EuiProvider } from '@elastic/eui'
import './global.css'
import icons from './icons'
import { useEffect, useState } from 'react'

const Render = () => {
    icons

    const [colorMode, setColorMode] = useState<'light' | 'dark'>('light')

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        setColorMode(mediaQuery.matches ? 'dark' : 'light')

        const handleChange = (event: MediaQueryListEvent) => {
            setColorMode(event.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)

        // 清除监听器
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [])

    return (
        <EuiProvider colorMode={colorMode}>
            <App />
        </EuiProvider>
    )
}

createRoot(document.getElementById('root')!).render(
    <Render />
)