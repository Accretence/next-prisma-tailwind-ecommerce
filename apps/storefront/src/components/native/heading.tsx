interface HeadingProps {
   title: string
   description: string
   specialDiv?: React.ReactNode
}

export const Heading: React.FC<HeadingProps> = ({
   title,
   description,
   specialDiv,
}) => {
   return (
      <div className="my-4 flex  justify-between  md:flex-row flex-col gap-4">
         <div>
            <h2 className="text-xl font-bold tracking-tight leading-tight">
               {title}
            </h2>
            <p className="text-xs text-muted-foreground">{description}</p>
         </div>
         {specialDiv}
      </div>
   )
}
