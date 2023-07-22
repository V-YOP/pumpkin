import { ImageCard } from "@/ImageCard"
import { Button, Container, Menu, MenuButton, MenuItem, MenuList, VStack, Text, Box, Image, SimpleGrid, HStack, IconButton, useColorMode } from "@chakra-ui/react"
import { Gallery, Item } from 'react-photoswipe-gallery'
import { Masonry } from "masonic";
import { useEffect, useMemo, useState } from "react";
import { ImageMeta } from "@/ImageMeta";

async function getStaticAlbumData(): Promise<ImageMeta[]> {
  const data = await fetch('STATIC_ALBUM.json')
  return data.json()
}

function App() {
  const { colorMode, toggleColorMode } = useColorMode()
  const [metaDatas, setMetaDatas] = useState<ImageMeta[]>([])
  const allAlbums = useMemo<string[]>(() => [...new Set(metaDatas.map(x=>x.albumName))], [metaDatas])

  const [currentAlbum, setCurrentAlbum] = useState('')
  const images = useMemo<ImageMeta[]>(() => 
    metaDatas
      .filter(x => x.albumName === currentAlbum)
      .sort((a, b) => a.imageName === b.imageName ? 0 : a.imageName < b.imageName ? -1: 1), 
    [currentAlbum, metaDatas])
  useEffect(() => {
    (async () => {
      const datas = await getStaticAlbumData()
      setMetaDatas(datas)
      setCurrentAlbum(datas[0].albumName)
    })()
  }, [])
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
      <Gallery>
        <Masonry key={currentAlbum} columnWidth={150} maxColumnCount={7}  columnGutter={15} rowGutter={10} items={[...images]} render={({index, data: {imageName, original, thumbnail, width, height}}) => (
          <Item key={imageName} original={"//" + original} thumbnail={"//" + thumbnail} width={width} height={height}>
            {({ ref, open }) => (
              <Box ref={ref as any} onClick={open}>
                <ImageCard src={"//" + thumbnail} imageName={imageName} />
              </Box>
            )}
          </Item>
        )}></Masonry>
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
