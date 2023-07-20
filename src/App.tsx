import { Button, Container, Menu, MenuButton, MenuItem, MenuList, VStack, Text, Box, Image, SimpleGrid } from "@chakra-ui/react"
import { Gallery, Item } from 'react-photoswipe-gallery'

const images: Record<string, {width: number, height: number}> = {
  '0001_coldcat_夏服モカ_108669886_p0.jpg': { width: 1300, height: 1500 },
  '0002_coldcat_夏服モカ_108669886_p1.jpg': { width: 1400, height: 1300 },
  '0003_coldcat_舟_108335100_p0.jpg': { width: 2400, height: 1800 },
  '0006_coldcat_バニー_108214585_p0.jpg': { width: 1800, height: 1500 },
  '0007_coldcat_Gを見つけたクーカー_108183739_p0.jpg': { width: 1400, height: 1300 },
  '0008_coldcat_Gを見つけたクーカー_108183739_p1.jpg': { width: 1400, height: 1300 },
  '0012_coldcat_迭娅_107611018_p2.jpg': { width: 1400, height: 1500 },
  '0013_coldcat_かのくぅ_107428079_p0(1).jpg': { width: 1883, height: 2190 },
  '0014_coldcat_ちされん_107248739_p0.jpg': { width: 1400, height: 1400 },
  '0015_coldcat_ちされん_107248739_p1.jpg': { width: 1400, height: 1500 },
  '0016_coldcat_Liella！_107212004_p0.jpg': { width: 1200, height: 1200 },
  '0017_coldcat_Liella！_107212004_p1.jpg': { width: 1400, height: 1080 }
}

function App() {
  return (
    <VStack mt={4}>
      <Menu>
        <MenuButton as={Button} w={['95vw', 'lg']}>
          <Box overflow='hidden' textOverflow='ellipsis'>
            Actiondddddasdasdsadsaddad sadasdsada ddddddddasdasdass fadfsadfsdaasdafsdasdfadsfafsddfasaddddddsdfas dfdfsfsdasdfasfsdas 
            </Box>
        </MenuButton>
        <MenuList w={['95vw', 'lg']}>
          <MenuItem>Download</MenuItem>
          <MenuItem>Create a copy</MenuItem>
          <MenuItem>Mark as Draft</MenuItem>
          <MenuItem>Delete</MenuItem>
          <MenuItem>Attend a Workshop</MenuItem>
        </MenuList>
      </Menu>
      <Container pl={[0, 4]} pr={[0, 4]} maxW={['100vw', '95vw', '90vw', '85vw']}>
      <Gallery>
        <SimpleGrid minChildWidth='180px' spacingY={4} justifyContent='center' justifyItems='center'>
        {Object.entries(images).map(([f, {width, height}]) => {
            return <Item key={f} original={f} width={width} height={height}>
              {({ ref, open }) => (
                <VStack w={'180px'} pl='5px' pr='5px' overflow='hidden'>
                  <Image ref={ref as any} onClick={open} src={f} />
                  <Text>{f}</Text>
                </VStack>
              )}
            </Item>
          })}
        </SimpleGrid>
      </Gallery>
      </Container>
    </VStack>
  )
}

export default App
