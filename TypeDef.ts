// picture metadata type definition, used in typescript code

declare interface Window {
    /**
     * picture List, sorted by createdTime, nulls last
     * 
     * TODO add query param
     */
    pictureList: () => Picture[]
}

interface Picture {
    /**
     * unique ID, never changed once created, maybe used for comment
     */
    id: string,
    name: string,
    createdTime?: Date,
    tag: string[],
    /**
     * category sequence, for example, ['anime', 'screenshot'] means anime-screenshot
     */
    category: string[],
    /**
     * markdown text
     */
    description: string,
    url: string,
    low_quantity_url: string,
    size: [x: number, y: number],
    /**
     * file size, byte
     */
    fileSize: number
}