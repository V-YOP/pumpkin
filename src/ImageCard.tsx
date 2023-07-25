import { Card, CardBody, Text, Image, Heading, Stack, CardFooter, Divider, Button, ButtonGroup, Box } from "@chakra-ui/react"
import { FC } from "react"

type ImageCardProp = {
  imageName: string,
  src: string,
  // width: number,
  // height: number
}

export const ImageCard: FC<ImageCardProp> = ({
  imageName,
  src
}) => (
  <Card>
  <CardBody p={0}>
    <Image borderTopLeftRadius='md' borderTopRightRadius='md' src={src} />
  </CardBody>
  <CardFooter pt={2} pb={2} pl={[1, 2]} pr={[1, 2]} overflow='hidden' textOverflow='ellipsis'>
    <Text overflowWrap='anywhere'>{imageName}</Text>
  </CardFooter>
  </Card>
)

ImageCard.displayName = 'ImageCard'