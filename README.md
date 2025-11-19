/*
  Componente Slider (reutilizável)

  Props:
  - items: array (opcional) - array de dados a serem renderizados (se usar renderItem)
  - renderItem: function(item, index) => ReactNode (opcional) - callback de renderização usado com items
  - children: ReactNode(s) (opcional) - se já tiver nós React (ex.: <Card />) você pode passar como children
  - slidesToShow: number (default 5) - número preferido de slides visíveis em telas grandes
  - gap: number (px) espaço entre slides (default 24)
  - infinite: boolean (default false)
  - autoplay: boolean (default false)
  - autoplayInterval: number ms (default 4000)
  - maxItemWidth: number (px) largura máxima de cada item/slide (default 288)
*/
