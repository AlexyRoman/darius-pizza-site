'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <section className='relative overflow-hidden bg-background'>
      <div className='mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
        <div className='mx-auto max-w-3xl text-center'>
          <h1 className='text-4xl md:text-5xl font-primary font-bold tracking-tight text-foreground'>
            Darius Pizza
          </h1>
          <p className='mt-4 text-lg text-foreground-secondary font-secondary'>
            Authentic Italian pizza made with love, tradition, and the finest
            ingredients
          </p>
          <div className='mt-8 flex items-center justify-center gap-3'>
            <Link
              className='inline-flex h-12 items-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-theme hover:bg-primary-hover hover:shadow-xl'
              href='/menu'
            >
              View Our Menu
            </Link>
            <a
              className='inline-flex h-12 items-center rounded-lg border-2 border-primary px-8 text-sm font-medium text-primary shadow-sm transition-all duration-theme hover:bg-primary hover:text-primary-foreground'
              href='#'
            >
              Order Now
            </a>
          </div>
        </div>

        {/* Featured Pizzas */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              name: 'Margherita',
              description: 'Classic tomato, mozzarella, and fresh basil',
            },
            {
              name: 'Pepperoni',
              description: 'Spicy pepperoni with our signature tomato sauce',
            },
            {
              name: 'Quattro Stagioni',
              description: 'Four seasons of Italian flavors in one pizza',
            },
          ].map((pizza, i) => (
            <div
              key={i}
              className='rounded-xl border border-border bg-background-elevated p-6 shadow-md transition-all duration-theme hover:shadow-lg hover:border-primary'
            >
              <div className='h-16 w-16 rounded-full bg-accent mb-4 flex items-center justify-center'>
                <span className='text-2xl'>🍕</span>
              </div>
              <h3 className='font-primary font-semibold mb-2 text-lg text-foreground'>
                {pizza.name}
              </h3>
              <p className='text-sm text-foreground-secondary font-secondary'>
                {pizza.description}
              </p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
          {[
            {
              icon: '🔥',
              title: 'Wood-Fired Oven',
              description: 'Traditional cooking method for authentic taste',
            },
            {
              icon: '🌿',
              title: 'Fresh Ingredients',
              description: 'Locally sourced, organic ingredients daily',
            },
            {
              icon: '👨‍🍳',
              title: 'Master Chef',
              description: 'Handcrafted by our Italian-trained chef',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className='rounded-xl border border-border bg-background-elevated p-6 shadow-md transition-all duration-theme hover:shadow-lg'
            >
              <div className='h-16 w-16 rounded-full bg-secondary mb-4 flex items-center justify-center'>
                <span className='text-2xl'>{feature.icon}</span>
              </div>
              <h3 className='font-primary font-semibold mb-2 text-lg text-foreground'>
                {feature.title}
              </h3>
              <p className='text-sm text-foreground-secondary font-secondary'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className='mt-16 text-center'>
          <div className='rounded-xl bg-primary/10 border border-primary/20 p-8'>
            <h2 className='font-primary text-2xl font-bold text-primary mb-4'>
              Ready for Authentic Italian Pizza?
            </h2>
            <p className='text-foreground-secondary mb-6 font-secondary'>
              Experience the taste of Italy with our handcrafted pizzas made
              fresh daily
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <Link
                className='inline-flex h-12 items-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-theme hover:bg-primary-hover hover:shadow-xl'
                href='/menu'
              >
                Explore Menu
              </Link>
              <a
                className='inline-flex h-12 items-center rounded-lg bg-accent px-8 text-sm font-medium text-foreground shadow-lg transition-all duration-theme hover:bg-accent/90 hover:shadow-xl'
                href='#'
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className='pointer-events-none absolute inset-0 -z-10 opacity-5 [background:radial-gradient(600px_circle_at_50%_0%,theme(colors.primary.DEFAULT)/40%,transparent_60%)]' />
    </section>
  );
}
