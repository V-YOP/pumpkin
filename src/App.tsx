import { ImageCard } from "@/ImageCard"
import { Button, Container, Menu, MenuButton, MenuItem, MenuList, VStack, Text, Box, Image, SimpleGrid, HStack, IconButton, useColorMode, useMediaQuery, useBreakpoint, useBreakpointValue, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react"
import { Gallery, Item } from 'react-photoswipe-gallery'
import { Masonry } from "masonic";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ImageMeta } from "@/ImageMeta";
import { useGallery } from "@/useGallery";

function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const {images, currentAlbum, setCurrentAlbum, allAlbums} = useGallery({
    type: 'STATIC_GALLERY',
    metaDataUrl: 'STATIC_ALBUM.json'
  })
  
  return (
    <VStack mt={4}>
      <HStack w={['100vw', 'md', 'lg']} pl={[2, 0]} pr={[2, 0]} justifyContent='center'>
        <Menu>
          <MenuButton as={Button} flexGrow={1}>
            <Box overflow='hidden' textOverflow='ellipsis'>
              {currentAlbum}
            </Box>
          </MenuButton>
          {
            allAlbums.length > 1 &&
            <MenuList w={['100vw', 'md', 'lg']}>
            {allAlbums.map(albumName => (
            <MenuItem 
              justifyContent='center' 
              key={albumName} 
              value={albumName}
              onClick={() => setCurrentAlbum(albumName)}>{`${albumName === currentAlbum ? '> ': ''}${albumName}`}
            </MenuItem>))}
          </MenuList>
          }
        </Menu>
        <IconButton aria-label="" onClick={toggleColorMode} />
      </HStack>
      
      <Container pl={[1, 4]} pr={[1, 4]} maxW={['100%', '95vw', '90vw', '85vw']}>

        <Masonry itemKey={img=>img.original} key={currentAlbum} columnWidth={useBreakpointValue([150, 200, 220])} maxColumnCount={useBreakpointValue([7, 10])}  columnGutter={10} rowGutter={10} items={[...images]} render={({index, data: {imageName, original, thumbnail, width, height}}) => {
          console.log(index)
          return (
            // 瀑布流布局难以获得图片的顺序，这里直接摆烂
            // 待grid布局再。
            <Gallery withDownloadButton options={{tapAction: 'close'}}>
              <Item key={index} original={`//${original}`} thumbnail={"//" + thumbnail} width={width} height={height}>
                {({ ref, open }) => (
                  <Box ref={ref as any} onClick={open}>
                    <ImageCard src={"//" + thumbnail} imageName={imageName} />
                  </Box>
                )}
              </Item>
            </Gallery>
        )}}></Masonry>
        {/* <Gallery withDownloadButton options={{tapAction: 'close'}}>
        <SimpleGrid columns={[2, 2, 3, 4, 5, 6]} spacingX={[1, 2, 3, 4]} spacingY={4} justifyContent='center' justifyItems='center'>
        {images.map(({width, height, original, thumbnail, imageName}) => {
            return <Item key={original} original={"//" + original} width={width} height={height}>
              {({ ref, open }) => (
                <Box ref={ref as any} onClick={open}>
                  <ImageCard src={"//" + thumbnail} imageName={imageName} />
                </Box>
              )}
            </Item>
          })}
        </SimpleGrid>
        </Gallery> */}
      </Container>
    </VStack>
  )
}

export default App
