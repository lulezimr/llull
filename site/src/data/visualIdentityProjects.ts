const imageSections = (slug: string, title: string, images: string[]) =>
  images.map((filename) => {
    const id = filename.slice(0, filename.lastIndexOf("."))

    return {
      id: `${slug}-${id}`,
      image: `/media/${slug}/${filename}`,
      imageAlt: `${title} project image ${id}`,
      title: "",
      description: "",
    }
  })

export const visualIdentityProjects = [
  {
    slug: "ludolee",
    title: "LUDOLEE",
    category: "Brand identity",
    description:
      "This project involved creating a refined brand identity for a premium facial cream product. The goal was to communicate serenity, purity, and simplicity through visual design.",
    overview:
      "I developed a minimalist symbol representing a calm, balanced face, using a soft pastel color palette to evoke a sense of purity and gentle care. The visual identity was designed to feel modern, elegant, and approachable for wellness and skincare audiences.",
    coverImage: "/media/ludolee/test_cover-LUDO_Lee.png",
    coverAlt: "LUDOLEE logo on a neutral background",
    details: [
      {
        label: "Design Focus",
        text: [
          "Crafting a clean and recognizable logo mark that speaks to skincare benefits",
          "Selecting colors that communicate calmness and trust",
          "Creating visual harmony between form and feeling",
          "This identity can be applied across packaging, digital platforms, and branded materials.",
        ].join("\n"),
      },
    ],
    sections: [
      {
        id: "01",
        image: "/media/ludolee/01.jpg",
        imageAlt: "LUDOLEE logo on a white background",
        title: "",
        description: "",
      },
      {
        id: "02",
        image: "/media/ludolee/02.jpg",
        imageAlt: "LUDOLEE logo on a pink background",
        title: "",
        description: "",
      },
      {
        id: "03",
        image: "/media/ludolee/03.png",
        imageAlt: "LUDOLEE concept and process presentation",
        title: "",
        description: "",
      },
      {
        id: "04",
        image: "/media/ludolee/04.png",
        imageAlt: "LUDOLEE logo lockup presentation",
        title: "",
        description: "",
      },
      {
        id: "05",
        image: "/media/ludolee/05.png",
        imageAlt: "LUDOLEE logo color options presentation",
        title: "",
        description: "",
      },
      {
        id: "06",
        image: "/media/ludolee/06.png",
        imageAlt: "LUDOLEE color tint presentation",
        title: "",
        description: "",
      },
      {
        id: "07",
        image: "/media/ludolee/07.png",
        imageAlt: "LUDOLEE brand application section divider",
        title: "",
        description: "",
      },
      {
        id: "08",
        image: "/media/ludolee/08.jpg",
        imageAlt: "LUDOLEE identity shown across printed materials",
        title: "",
        description: "",
      },
      {
        id: "09",
        image: "/media/ludolee/09.jpg",
        imageAlt: "LUDOLEE facial cream packaging",
        title: "",
        description: "",
      },
      {
        id: "10",
        image: "/media/ludolee/10.jpg",
        imageAlt: "LUDOLEE identity displayed on a desktop computer",
        title: "",
        description: "",
      },
      {
        id: "11",
        image: "/media/ludolee/11.png",
        imageAlt: "LUDOLEE branded apparel and packaging",
        title: "",
        description: "",
      },
      {
        id: "12",
        image: "/media/ludolee/12.png",
        imageAlt: "LUDOLEE presentation closing slide",
        title: "",
        description: "",
      },
    ],
  },
  {
    slug: "afasjob",
    title: "AFASJOB",
    category: "Brand identity design",
    description:
      "AFAS is a platform offering training, research, and consultancy for businesses, industries, and public institutions, while also providing job updates and career guidance for candidates.",
    overview:
      "For this project, I created a fully custom logo from scratch and developed a modern visual identity that communicates professionalism, trust, and clarity.",
    coverImage: "/media/afasjob/Cover_AfasJOB.png",
    coverAlt: "AFASJOB wordmark on a light neutral background",
    details: [
      {
        label: "My focus included",
        text: [
          "- A clean and highly legible logo system",
          "- A color palette reflecting stability and dynamism",
          "- Visual applications optimized for web, training materials, and job announcement posts",
        ].join("\n"),
      },
    ],
    sections: imageSections("afasjob", "AFASJOB", [
      "01.jpg",
      "02.jpg",
      "03.jpg",
      "04.jpg",
      "05.jpg",
      "07.jpg",
    ]),
  },
  {
    slug: "roze",
    title: "ROZE",
    category: "Brand identity / mountain tea producer",
    description:
      "ROZË is a brand identity created for a traditional mountain tea producer with a focus on natural remedies, wellness, and handcrafted quality.",
    overview:
      "The goal of this project was to design a visual identity that reflects the brand’s connection to nature, authenticity, and heritage.",
    coverImage: "/media/roze/Cover-framed.png",
    coverAlt: "ROZË mountain tea packaging on a warm neutral background",
    details: [
      {
        label: "Project concept",
        text: [
          "The identity system was crafted to communicate organic simplicity, herbal quality, and rustic elegance.",
          "The design emphasizes natural aesthetics with clean visual elements that blend modern branding with traditional values.",
        ].join(" "),
      },
      {
        label: "Key design elements",
        text: [
          "- A logo mark inspired by nature and plant forms, symbolizing wellness and purity",
          "- A color palette drawn from earthy tones associated with mountain landscapes",
          "- Visual components that support usage across packaging, labels, and marketing materials",
        ].join("\n"),
      },
      {
        label: "Project note",
        text: "This work demonstrates my ability to create a meaningful and adaptable brand identity for products rooted in tradition yet positioned for contemporary markets.",
      },
    ],
    sections: imageSections("roze", "ROZE", [
      "01.jpg",
      "02.jpg",
      "03.jpg",
      "04.jpg",
    ]),
  },
  {
    slug: "tickondo",
    title: "TICKONDO",
    category: "Brand identity",
    description:
      "Tickondo is a festival ticketing concept that visually celebrates the excitement of live events and experiences.",
    overview:
      "For this identity project, I developed a logo system that cleverly uses negative space to form a ticket shape, symbolizing accessibility, excitement, and memorable moments.",
    coverImage: "/media/tickondo/Cover_tikondo.png",
    coverAlt: "TICKONDO wordmark on a white background",
    details: [
      {
        label: "Project highlights",
        text: [
          "- A unique logo mark combining a ticket visual with clean typographic elements",
          "- A bold yet simple visual concept that communicates fun and function",
          "- A color and form approach that makes the brand instantly recognizable",
          "- Designed with adaptability in mind — suitable for digital, print, and promotional applications",
        ].join("\n"),
      },
      {
        label: "Project note",
        text: "This project demonstrates my ability to transform a simple concept into a visually strong identity with meaning and clarity.",
      },
    ],
    sections: imageSections("tickondo", "TICKONDO", [
      "01.png",
      "02.png",
      "03.jpg",
      "04.png",
      "05.png",
      "06.png",
      "07.png",
      "08.png",
      "09.jpg",
      "10.jpg",
      "11.jpg",
      "12.jpg",
    ]),
  },
  {
    slug: "linedesk",
    title: "LINEDESK",
    category: "Visual identity",
    description: "",
    overview: "",
    coverImage: "/media/linedesk/Cover-framed.png",
    coverAlt: "LINEDESK logo on a light gray background",
    details: [],
    sections: imageSections("linedesk", "LINEDESK", [
      "01.png",
      "02.png",
      "03.png",
      "04.png",
      "05.png",
      "06.png",
      "07.png",
    ]),
  },
] as const
