import { ImageCard } from "@/ImageCard"
import { Button, Container, Menu, MenuButton, MenuItem, MenuList, VStack, Text, Box, Image, SimpleGrid, HStack, IconButton, useColorMode } from "@chakra-ui/react"
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
          <MenuList w={['100vw', 'md', 'lg']}>
            {allAlbums.map(albumName => (
            <MenuItem 
              justifyContent='center' 
              key={albumName} 
              value={albumName}
              onClick={() => setCurrentAlbum(albumName)}>{`${albumName === currentAlbum ? '> ': ''}${albumName}`}
            </MenuItem>))}
          </MenuList>
        </Menu>
        <IconButton aria-label="" onClick={toggleColorMode} />
      </HStack>
      
      <Container pl={[1, 4]} pr={[1, 4]} maxW={['100%', '95vw', '90vw', '85vw']}>

      <Gallery withDownloadButton options={{tapAction: 'close'}}>
        <Masonry itemKey={img=>img.original} key={currentAlbum} columnWidth={150} maxColumnCount={7}  columnGutter={15} rowGutter={10} items={[...images]} render={({index, data: {imageName, original, thumbnail, width, height}}) => {
          console.log(index)
          return (
            <Item key={index} original={`//${original}`} thumbnail={"//" + thumbnail} width={width} height={height}>
            {({ ref, open }) => (
              <Box ref={ref as any} onClick={open}>
                <ImageCard src={"//" + thumbnail} imageName={imageName} />
              </Box>
            )}
          </Item>
        )}}></Masonry>
        {/* <SimpleGrid columns={[2, 2, 3, 4, 5, 6]} spacingX={[0, 2, 3, 4]} spacingY={4} justifyContent='center' justifyItems='center'>
        {Object.entries(images).map(([f, {width, height}]) => {
            return <Item key={f} original={f} width={width} height={height}>
              {({ ref, open }) => (
                <Box ref={ref as any} onClick={open}>
                  <ImageCard src={f} imageName={f} />
                </Box>
              )}
            </Item>
          })}
        </SimpleGrid> */}
          </Gallery>
      </Container>
    </VStack>
  )
}

export default App
