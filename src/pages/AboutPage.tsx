export const AboutPage = () => {
  return (
    <div className="space-y-5">
      <h1 className="text-center text-4xl font-semibold tracking-tight mb-5">
        Nuestra Tienda
      </h1>
      <img
        src="https://www.nestleprofessional-latam.com/sites/default/files/styles/np_article_small/public/2024-04/todo-necesario-abrir-cafeteria-mesera.jpg?itok=zQ9ycj8J"
        alt="Imagen de la Tienda"
        className="h-[600px] w-full object-none"
      />
      <div className="flex flex-col gap-4 tracking-tighter leading-7 text-sm font-medium text-slate-800">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolore
          voluptas, veritatis saepe est totam dolorum quas! Reiciendis
          dignissimos similique dolore iusto suscipit voluptatibus, ducimus
          nisi. Necessitatibus explicabo nihil aut labore.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas quas
          fugiat pariatur, suscipit eligendi iusto natus, dicta ut eaque vel
          accusantium voluptatem eos, explicabo deleniti neque facilis soluta
          culpa illo?
        </p>
        <h2 className="text-3xl font-semibold tracking-tighter mt-8 mb-4">
          ¡No esperes más y realiza tu compra!
        </h2>
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam
          nesciunt illum voluptas tempore reiciendis quia culpa error.
        </p>
        <p>
          Para más información, no dudes en ponerte en contacto con nostros, a
          través de nuestro canales de atención:
          <a href="mailto:correo@pruebas.com"> correo@pruebas.com</a> o llamando
          al
          <a href="cel: 1234567890"> 1234567890</a>
        </p>
      </div>
    </div>
  );
};
