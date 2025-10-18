'use client';

import React from 'react';
import {
  Heart,
  Users,
  Award,
  Clock,
  MapPin,
  Phone,
  ChefHat,
  Wheat,
  Flame,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ContactFormSection from '@/components/sections/ContactFormSection';
import { useTranslations } from 'next-intl';

export default function InfoPage() {
  const t = useTranslations('aboutUs');
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-background-secondary'>
      {/* Hero Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-primary/5 via-accent/5 to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <Heart className='h-8 w-8 text-primary fill-primary' />
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-primary font-bold text-foreground'>
                {t('hero.title')}
              </h1>
              <Heart className='h-8 w-8 text-primary fill-primary' />
            </div>
            <p className='text-xl text-foreground-secondary font-secondary leading-relaxed max-w-3xl mx-auto'>
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center'>
              <div className='space-y-8'>
                <div className='space-y-4'>
                  <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground'>
                    {t('story.title')}
                  </h2>
                  <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                    {t('story.description1')}
                  </p>
                  <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                    {t('story.description2')}
                  </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <Card className='bg-background-elevated border-border/50'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <ChefHat className='h-6 w-6 text-primary' />
                        <h3 className='font-semibold text-foreground'>
                          {t('story.traditionalRecipes')}
                        </h3>
                      </div>
                      <p className='text-sm text-foreground-secondary'>
                        {t('story.traditionalRecipesDesc')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className='bg-background-elevated border-border/50'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <Wheat className='h-6 w-6 text-primary' />
                        <h3 className='font-semibold text-foreground'>
                          {t('story.freshIngredients')}
                        </h3>
                      </div>
                      <p className='text-sm text-foreground-secondary'>
                        {t('story.freshIngredientsDesc')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className='relative'>
                <Card className='overflow-hidden shadow-2xl border-border/50'>
                  <CardContent className='p-0'>
                    <div className='relative h-96 lg:h-[500px] overflow-hidden'>
                      <img
                        src='/IMG_9209.jpg'
                        alt='Traditional Italian kitchen with family preparing pizza'
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

                      <div className='absolute bottom-6 left-6'>
                        <Badge className='bg-background/90 backdrop-blur-sm border border-border/50 text-foreground'>
                          <Award className='h-4 w-4 mr-2 text-primary' />
                          {t('story.familyOwnedBadge')}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-4'>
                {t('values.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary max-w-2xl mx-auto'>
                {t('values.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              <Card className='text-center bg-background-elevated border-border/50 hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Heart className='h-8 w-8 text-primary fill-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground'>
                    {t('values.passion.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    {t('values.passion.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className='text-center bg-background-elevated border-border/50 hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Users className='h-8 w-8 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground'>
                    {t('values.community.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    {t('values.community.description')}
                  </p>
                </CardContent>
              </Card>

              <Card className='text-center bg-background-elevated border-border/50 hover:shadow-lg transition-shadow'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Flame className='h-8 w-8 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground'>
                    {t('values.quality.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    {t('values.quality.description')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background via-background-secondary to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-4'>
                {t('contact.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary'>
                {t('contact.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-12'>
              <Card className='text-center bg-background-elevated border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <MapPin className='h-6 w-6 text-primary' />
                    </div>
                  </div>
                  <h3 className='font-semibold text-foreground mb-2'>
                    {t('contact.location')}
                  </h3>
                  <p
                    className='text-sm text-foreground-secondary'
                    dangerouslySetInnerHTML={{ __html: t('contact.address') }}
                  />
                </CardContent>
              </Card>

              <Card className='text-center bg-background-elevated border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Clock className='h-6 w-6 text-primary' />
                    </div>
                  </div>
                  <h3 className='font-semibold text-foreground mb-2'>
                    {t('contact.hours')}
                  </h3>
                  <p
                    className='text-sm text-foreground-secondary'
                    dangerouslySetInnerHTML={{ __html: t('contact.schedule') }}
                  />
                </CardContent>
              </Card>

              <Card className='text-center bg-background-elevated border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Phone className='h-6 w-6 text-primary' />
                    </div>
                  </div>
                  <h3 className='font-semibold text-foreground mb-2'>
                    {t('contact.contact')}
                  </h3>
                  <p
                    className='text-sm text-foreground-secondary'
                    dangerouslySetInnerHTML={{ __html: t('contact.phone') }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <div id='contact'>
        <ContactFormSection />
      </div>
    </div>
  );
}
