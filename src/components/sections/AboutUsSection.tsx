'use client';

import React from 'react';
import { Heart, Users, Award, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function AboutUsSection() {
  const t = useTranslations('aboutUs');
  const tHome = useTranslations('aboutUs.homeAbout');
  return (
    <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background to-background-secondary'>
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
            {/* Content Section */}
            <div className='space-y-8 text-center lg:text-left'>
              {/* Section Header */}
              <div className='space-y-4'>
                <div className='flex items-center justify-center lg:justify-start gap-2'>
                  <Heart className='h-6 w-6 text-primary fill-primary' />
                  <h2 className='text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-foreground'>
                    {tHome('title')}
                  </h2>
                </div>
                <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                  {tHome('description')}
                </p>
              </div>

              {/* Features Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 mb-2'>
                    <Users className='h-5 w-5 text-primary' />
                    <h3 className='font-semibold text-foreground'>
                      {tHome('familyOwned')}
                    </h3>
                  </div>
                  <p className='text-sm text-foreground-secondary'>
                    {tHome('familyOwnedDesc')}
                  </p>
                </div>

                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 mb-2'>
                    <Award className='h-5 w-5 text-primary' />
                    <h3 className='font-semibold text-foreground'>
                      {tHome('authentic')}
                    </h3>
                  </div>
                  <p className='text-sm text-foreground-secondary'>
                    {tHome('authenticDesc')}
                  </p>
                </div>

                <div className='text-center lg:text-left'>
                  <div className='flex items-center justify-center lg:justify-start gap-2 mb-2'>
                    <Heart className='h-5 w-5 text-primary fill-primary' />
                    <h3 className='font-semibold text-foreground'>
                      {tHome('madeWithLove')}
                    </h3>
                  </div>
                  <p className='text-sm text-foreground-secondary'>
                    {tHome('madeWithLoveDesc')}
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
                <Button
                  asChild
                  size='lg'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground'
                >
                  <Link href='/info#contact'>
                    {tHome('contactUs')}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                  <Link href='/info'>{t('cta.learnMore')}</Link>
                </Button>
                <Button asChild variant='outline' size='lg'>
                  <Link href='/menu'>{t('cta.viewMenu')}</Link>
                </Button>
              </div>
            </div>

            {/* Image Section */}
            <div className='relative'>
              <Card className='overflow-hidden shadow-2xl border-border/50'>
                <CardContent className='p-0'>
                  <div className='relative h-96 lg:h-[500px] overflow-hidden'>
                    <img
                      src='https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                      alt='Traditional Italian pizza kitchen with chef preparing authentic pizza'
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

                    {/* Floating Badge */}
                    <div className='absolute top-6 right-6'>
                      <div className='bg-background/90 backdrop-blur-sm border border-border/50 rounded-full px-4 py-2 shadow-lg'>
                        <div className='flex items-center gap-2'>
                          <Award className='h-4 w-4 text-primary' />
                          <span className='text-sm font-medium text-foreground'>
                            {tHome('since1985')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Decorative Elements */}
              <div className='absolute -top-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-xl' />
              <div className='absolute -bottom-4 -right-4 w-32 h-32 bg-accent/10 rounded-full blur-xl' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
