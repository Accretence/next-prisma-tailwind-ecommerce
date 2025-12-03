import { PrismaClient } from '@prisma/client'

function getRandomFloat(min, max, precision) {
   if (min >= max || precision < 0) {
      throw new Error(
         'Invalid input: min should be less than max and precision should be non-negative.'
      )
   }

   const range = max - min
   const randomValue = Math.random() * range + min

   return parseFloat(randomValue.toFixed(precision))
}

function getRandomIntInRange(min: number, max: number) {
   return Math.floor(Math.random() * (max - min) + min)
}

function getRandomDate(start, end) {
   return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
   )
}

function getRandomBoolean() {
   return getRandomIntInRange(0, 2) == 0 ? false : true
}

const prisma = new PrismaClient()

async function main() {
   let createdProducts = [],
      createdProviders = []

   const providers = ['Parsian', 'Pasargad', 'Dey']

   const owners = ['sesto@post.com']

   const categories = [
      'Electronics',
      'Clothing',
      'Books',
      'Home & Kitchen',
      'Toys',
      'Jewelery',
      'Accessories',
   ]

   const products = [
      {
         title: 'BKID Pipe',
         brand: 'BKID',
         categories: ['Accessories'],
         keywords: ['pipe', 'brushed', 'wood'],
         price: 69.99,
         images: ['https://lemanoosh.com/app/uploads/bkid-pipe-01.jpg'],
      },
      {
         title: 'Bang and Olufsen Speaker',
         brand: 'Bang and Olufsen',
         categories: ['Electronics'],
         keywords: ['speaker', 'brushed', 'mechanical'],
         price: 9.99,
         images: [
            'https://lemanoosh.com/app/uploads/BO_2019_A1_Natural_Brushed_05-768x1156.jpg',
         ],
      },
      {
         title: 'Audio Technica Turn-table',
         brand: 'Audio Technica',

         categories: ['Electronics'],
         keywords: ['music', 'brushed', 'mechanical'],
         price: 12.99,
         images: [
            'https://lemanoosh.com/app/uploads/gerhardt-kellermann-zeitmagazin-10.jpg',
         ],
      },
      {
         title: 'Monocle Sneakers',
         brand: 'Monocle',

         categories: ['Electronics'],
         keywords: ['shoes', 'brushed', 'mechanical'],
         price: 1.99,
         images: [
            'https://lemanoosh.com/app/uploads/plp-women-footwear-sneakers-04-07-768x1246.jpg',
         ],
      },
      {
         title: 'Zone2 Mens Watch',
         brand: 'Zone2',

         categories: ['Electronics'],
         keywords: ['shoes', 'brushed', 'mechanical'],
         price: 129.99,
         images: ['https://lemanoosh.com/app/uploads/0055-768x1023.jpg'],
      },
      {
         title: 'Carl Hauser L1 Phone',
         brand: 'Carl Hauser',
         categories: ['Electronics'],
         keywords: ['shoes', 'brushed', 'mechanical'],
         price: 5.99,
         images: [
            'https://lemanoosh.com/app/uploads/carl-hauser-0121-768x993.jpg',
         ],
      },
      {
         title: 'Carl Hauser Scanner',
         brand: 'Carl Hauser',
         categories: ['Electronics'],
         keywords: ['shoes', 'brushed', 'mechanical'],
         price: 22.99,
         images: [
            'https://lemanoosh.com/app/uploads/carl-hauser-020-768x973.jpg',
         ],
      },
      {
         title: 'Bright Neon Helmet',
         brand: 'Bright',
         categories: ['Electronics'],
         keywords: ['shoes', 'brushed', 'mechanical'],
         price: 17.99,
         images: [
            'https://lemanoosh.com/app/uploads/Orange_white-_Helmet_01.jpg',
         ],
      },
   ]

   const blogPosts = [
      {
         slug: 'how-can-ai',
         title: 'How can AI be used to generate revenue in the cryptocurrency space',
         description: 'In this article, young and...',
         image: 'https://media.product.which.co.uk/prod/images/original/3cc919e52b08-apple-wwcd23-vision-pro-lifestyle-working-230605.jpg',
         categories: ['technology', 'architecture'],
         content:
            "In this blog post we'll go over how AI can be used to generate revenue in the cryptocurrency space. For example in spaces like DAOs ( Decentralized autonomous organizations ). Decentralized autonomous organizations, or DAOs, are using AI to manage and automate their processes in order to save on costs. This increased efficiency can lead to more revenue for the organization. <MDXImage alt='Artificial Intelligence' src='https://cdn.dribbble.com/users/1358460/screenshots/14313986/media/cf14d4ef432f3a05078df0ac1d1e7387.jpg' /> To provide a clear real-world example of how AI tools like OpenAI's GPT-3 or DALL·E 2 can be used in the DAO ( Decentralized Autonomous Organizations ) space, let's take a look at the example of a digital marketing campaign: In the past, a typical digital marketing campaign might have required hiring an external agency or consultants to manage various aspects of the project including content creation, graphic design, website development, and social media outreach. With AI tools like GPT-3 and DALL·E 2 now available, however, it's possible for DAOs to automate many of these tasks internally without needing to hire outside help. This can lead to significant cost savings for the organization while still maintaining high-quality standards. Additionally, by using AI-powered tools like GPT-3 or DALL·E 2 , DAOs can scale their operations much more easily and reach a larger audience with less effort than traditional methods require.",
      },
      {
         slug: 'how-ai-generated',
         title: 'How AI-Generated Content Will Impact the Future of Architectural Engineering',
         description: 'AI-powered software Midjourney...',
         image: 'https://pbs.twimg.com/media/Fx5CjjBWcAEEte0.jpg',
         categories: ['technology', 'design', 'academic'],
         content:
            "With the increased use of artificial intelligence (AI) in content generation, it is important to consider how this technology will impact the future of architectural engineering. For example, OpenAI's GPT3 or DALL·E 2 can be used to generate realistic 3D models of buildings or structures. This could potentially reduce the need for architects to create these models by hand. Additionally, AI-generated content could be used to create realistic simulations of proposed buildings or structures, and to render them in very realistic manners. <MDXImage alt='AI Generated Content' src='vhttps://cdn.80.lv/api/upload/content/ef/62ab0fc526d9a.jpeg' /> This could help architects to better assess the feasibility of a project before construction begins. It is important to note that AI-generated content is not perfect and there may be some errors. However, as the technology improves, it is likely that these error rates will decrease. Additionally, AI-generated content can be customized to meet the specific needs of a project. For example, if an architect wants to see how a building will look in different lighting conditions, they can use an AI program to generate multiple versions of the same model. They can change the design of the model to make it look more original. Overall, AI-generated content has the potential to greatly impact the field of architectural engineering. As technology improves, it is likely that more and more architects will begin to use AI-generated content in their work. In conclusion, AI-generated content has the potential to revolutionize architectural engineering. It can help reduce the workload of architects and provide them with more accurate information about proposed projects.",
      },
      {
         slug: 'sci-fi-environmental',
         title: 'Sci-Fi Environmental Concept Art with Midjourney',
         description:
            'Examples AI Generated Images can be used to enhance concept design.',
         image: 'https://intl.nothing.tech/cdn/shop/files/PC2_2160x.jpg?v=1680179311',
         categories: ['technology', 'design', 'game-design'],
         content:
            "In this blog post we'll go over how AI can be used to generate revenue in the cryptocurrency space. For example in spaces like DAOs ( Decentralized autonomous organizations ). Decentralized autonomous organizations, or DAOs, are using AI to manage and automate their processes in order to save on costs. This increased efficiency can lead to more revenue for the organization. <MDXImage alt='Artificial Intelligence' src='https://cdn.dribbble.com/users/1358460/screenshots/14313986/media/cf14d4ef432f3a05078df0ac1d1e7387.jpg' /> To provide a clear real-world example of how AI tools like OpenAI's GPT-3 or DALL·E 2 can be used in the DAO ( Decentralized Autonomous Organizations ) space, let's take a look at the example of a digital marketing campaign: In the past, a typical digital marketing campaign might have required hiring an external agency or consultants to manage various aspects of the project including content creation, graphic design, website development, and social media outreach. With AI tools like GPT-3 and DALL·E 2 now available, however, it's possible for DAOs to automate many of these tasks internally without needing to hire outside help. This can lead to significant cost savings for the organization while still maintaining high-quality standards. Additionally, by using AI-powered tools like GPT-3 or DALL·E 2 , DAOs can scale their operations much more easily and reach a larger audience with less effort than traditional methods require.",
      },
   ]

   const banners = [
      {
         image: 'https://marketplace.canva.com/EAFgoIbXL34/1/0/1600w/canva-beige-minimalist-mother%27s-day-sale-promotional-banner-YpclZeIn87Q.jpg',
         label: 'Something',
      },
      {
         image: 'https://globaltv.es/wp-content/uploads/2022/10/bang-olufsen-salon.webp',
         label: 'Something',
      },
      {
         image: 'https://marketplace.canva.com/EAFhXw50O8Q/1/0/1600w/canva-beige-minimalist-fashion-collection-photo-collage-banner-VTuOcmKhSd4.jpg',
         label: 'Something',
      },
      {
         image: 'https://marketplace.canva.com/EAFOMzwkPtk/1/0/1600w/canva-chic-website-homepage-fashion-collage-banner-QtOtaBX5FCE.jpg',
         label: 'Something',
      },
   ]

   try {
      for (const banner of banners) {
         const { image, label } = banner

         await prisma.banner.create({
            data: {
               image,
               label,
            },
         })
      }

      console.log('Created Banners...')
   } catch (error) {
      console.error('Could not create banners...')
   }

   try {
      for (const owner of owners) {
         await prisma.owner.create({
            data: {
               email: owner,
            },
         })
      }

      console.log('Created Owners...')
   } catch (error) {
      console.error('Could not create owners...')
   }

   try {
      for (const category of categories) {
         await prisma.category.create({
            data: {
               title: category,
            },
         })
      }

      console.log('Created Categories...')
   } catch (error) {
      console.error('Could not create Categories...')
   }

   try {
      for (const product of products) {
         const createdProduct = await prisma.product.create({
            data: {
               isAvailable: getRandomBoolean(),
               title: product.title,
               price: getRandomFloat(20, 100, 2),
               stock: getRandomIntInRange(1, 20),
               discount: getRandomIntInRange(1, 15),
               brand: {
                  connectOrCreate: {
                     where: {
                        title: product.brand,
                     },
                     create: {
                        title: product.brand,
                        description: 'Description of this brand.',
                        logo: 'https://cdn.logojoy.com/wp-content/uploads/20221122125557/morridge-coffee-vintage-logo-600x392.png',
                     },
                  },
               },
               description: 'Description of this product.',
               images: product.images,
               keywords: product.keywords,
               categories: {
                  connect: {
                     title: product.categories[0],
                  },
               },
            },
            include: {
               categories: true,
            },
         })

         createdProducts.push(createdProduct)
      }

      console.log('Created Products...')
   } catch (error) {
      console.error('Could not create products...')
   }

   try {
      console.log('Assigning random cross-sell products...')

      for (const product of createdProducts) {
         // filter out the product itself
         const otherProducts = createdProducts.filter(
            (p) => p.id !== product.id
         )

         // choose a random number from 1 to 5 (or less if fewer products exist)
         const maxCrossSells = Math.min(5, otherProducts.length)
         const randomCount = Math.floor(Math.random() * maxCrossSells) + 1

         // shuffle + slice based on randomCount
         const randomCrossSells = otherProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, randomCount)

         await prisma.product.update({
            where: { id: product.id },
            data: {
               crossSellProducts: {
                  connect: randomCrossSells.map((p) => ({ id: p.id })),
               },
            },
         })
      }

      console.log('Random cross-sell assignment done!')
   } catch (error) {
      console.error('Could not assign cross-sell products...', error)
   }

   try {
      await prisma.author.create({
         data: {
            name: 'Amirhossein Mohammadi',
            email: 'sesto@post.com',
            blogs: {
               create: blogPosts,
            },
         },
      })

      console.log('Created Authors...')
   } catch (error) {
      console.error('Could not create authors...')
   }

   const user = await prisma.user.create({
      data: {
         email: 'sesto@post.com',
         name: 'Amirhossein Mohammadi',
         cart: {
            create: {},
         },
         wishlist: {
            connect: {
               id: createdProducts[
                  getRandomIntInRange(0, createdProducts.length - 1)
               ]['id'],
            },
         },
      },
   })

   console.log('Created Users...')

   for (const provider of providers) {
      const createdProvider = await prisma.paymentProvider.create({
         data: {
            title: provider,
         },
      })

      createdProviders.push(createdProvider)
   }

   console.log('Created Providers...')

   for (let i = 0; i < 10; i++) {
      const order = await prisma.order.create({
         data: {
            createdAt: getRandomDate(new Date(2023, 2, 27), new Date()),
            payable: getRandomFloat(20, 100, 2),
            discount: getRandomFloat(20, 100, 2),
            shipping: getRandomFloat(20, 100, 2),
            status: 'Processing',
            user: { connect: { id: user.id } },
            isPaid: true,
            payments: {
               create: {
                  status: 'Processing',
                  isSuccessful: true,
                  payable: getRandomFloat(20, 100, 2),
                  refId: getRandomFloat(1, 200, 2).toString(),
                  user: {
                     connect: { id: user.id },
                  },
                  provider: {
                     connect: {
                        id: createdProviders[
                           getRandomIntInRange(0, createdProviders.length - 1)
                        ].id,
                     },
                  },
               },
            },
            orderItems: {
               create: {
                  productId:
                     createdProducts[
                        getRandomIntInRange(0, createdProducts.length - 1)
                     ]?.id,
                  count: 1,
                  price: createdProducts[
                     getRandomIntInRange(0, createdProducts.length - 1)
                  ].price,
                  discount: 0,
               },
            },
         },
      })
   }

   console.log('Created Orders...')
}

try {
   main()
   prisma.$disconnect()
} catch (error) {
   console.error(error)
   process.exit(1)
}
