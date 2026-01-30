/**
 * Franja de beneficios (envío, devoluciones, pago seguro) para dar confianza.
 */
export default function StoreBenefits() {
  const items = [
    {
      title: "Envío a todo el país",
      desc: "Despacho en 24-48 hs hábiles",
    },
    {
      title: "Devoluciones gratis",
      desc: "30 días para cambiar o devolver",
    },
    {
      title: "Pago seguro",
      desc: "Tarjetas y transferencia",
    },
  ];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="container-fp">
        <ul className="flex flex-wrap justify-center gap-8 md:gap-16 py-4 text-center">
          {items.map((item) => (
            <li key={item.title} className="flex items-center gap-3">
              <span className="text-fp-black font-medium text-sm">{item.title}</span>
              <span className="text-fp-gray text-xs hidden sm:inline">—</span>
              <span className="text-fp-gray text-xs">{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
