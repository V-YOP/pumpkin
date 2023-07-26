import * as React from 'react'
import { ChakraProvider, Input } from '@chakra-ui/react'
import * as ReactDOM from 'react-dom/client'
import App from '@/App'
import { Test } from '@/Test'
import 'photoswipe/dist/photoswipe.css'
import 'react-medium-image-zoom/dist/styles.css'

const rootElement = document.getElementById('root')!
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </React.StrictMode>,
)
