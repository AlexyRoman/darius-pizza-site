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
                <div className='space-y-4'>
                  <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                    {tHome('description')}
                  </p>
                  <div className='flex items-center justify-center lg:justify-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20'>
                    <Heart className='h-5 w-5 text-primary fill-primary' />
                    <p className='text-sm font-medium text-primary'>
                      {tHome('madeWithLoveDesc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                {/* Family Owned Card */}
                <Card className='bg-background-elevated border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col items-center text-center space-y-4'>
                      <div className='p-3 bg-primary/10 rounded-full'>
                        <Users className='h-6 w-6 text-primary' />
                      </div>
                      <h3 className='text-lg font-semibold text-foreground'>
                        {tHome('familyOwned')}
                      </h3>
                      <p className='text-sm text-foreground-secondary leading-relaxed'>
                        {tHome('familyOwnedDesc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Authentic Card */}
                <Card className='bg-background-elevated border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'>
                  <CardContent className='p-6'>
                    <div className='flex flex-col items-center text-center space-y-4'>
                      <div className='p-3 bg-primary/10 rounded-full'>
                        <Award className='h-6 w-6 text-primary' />
                      </div>
                      <h3 className='text-lg font-semibold text-foreground'>
                        {tHome('authentic')}
                      </h3>
                      <p className='text-sm text-foreground-secondary leading-relaxed'>
                        {tHome('authenticDesc')}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Call to Action */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-6'>
                <Button
                  asChild
                  size='lg'
                  className='bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300'
                >
                  <Link href='/info#contact'>
                    {tHome('contactUs')}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300'
                >
                  <Link href='/info'>{t('cta.learnMore')}</Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='lg'
                  className='border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300'
                >
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
                      src='/IMG_9209.jpeg'
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
