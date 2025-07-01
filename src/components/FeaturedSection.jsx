import { products } from '../data/products'
function FeaturedSection({ title, filterFn }) {
  const items = products.filter(filterFn).slice(0, 3)
  return (
    <section className="my-12">
      <h3 className="text-2xl font-bold text-gold mb-6 font-serif">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {items.map(p => (
          <div key={p.id} className="bg-cream rounded-xl p-4 border border-gold">{p.name}</div>
        ))}
      </div>
    </section>
  )
}
export default FeaturedSection