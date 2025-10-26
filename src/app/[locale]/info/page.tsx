'use client';

import React from 'react';
import {
  Heart,
  MapPin,
  Phone,
  ChefHat,
  Wheat,
  Flame,
  Gauge,
  Clock3,
  Instagram,
  Facebook,
  MessageCircle,
  Star,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContactFormSection from '@/components/sections/ContactFormSection';
import InstagramFeed from '@/components/sections/InstagramFeed';
import {
  Comparison,
  ComparisonItem,
  ComparisonHandle,
} from '@/components/ui/shadcn-io/comparison';
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

      {/* Section 1: De l'Étal du Boucher au Feu de Bois */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-12'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-6'>
                {t('section1.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary leading-relaxed max-w-4xl mx-auto mb-8'>
                {t('section1.intro')}
              </p>
            </div>

            {/* Comparison Slider */}
            <div className='mb-12'>
              <Comparison className='aspect-video rounded-lg overflow-hidden shadow-2xl border border-border/50'>
                <ComparisonItem position='left'>
                  <img
                    src={t('section1.image1.src')}
                    alt={t('section1.image1.alt')}
                    className='w-full h-full object-cover'
                  />
                </ComparisonItem>
                <ComparisonItem position='right'>
                  <img
                    src={t('section1.image2.src')}
                    alt={t('section1.image2.alt')}
                    className='w-full h-full object-cover'
                  />
                </ComparisonItem>
                <ComparisonHandle />
              </Comparison>
            </div>

            <div className='text-center'>
              <p className='text-lg text-foreground-secondary font-secondary leading-relaxed max-w-4xl mx-auto whitespace-pre-line'>
                {t('section1.conclusion')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Le Secret d'une Pâte Inimitable */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-6'>
                {t('section2.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary leading-relaxed max-w-4xl mx-auto'>
                {t('section2.intro')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Card 1: Le Pétrissage et le Pointage */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Gauge className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section2.card1.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section2.card1.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed'>
                    {t('section2.card1.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section2.card1.image.src')}
                      alt={t('section2.card1.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: La Maturation à Froid */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Clock3 className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section2.card2.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section2.card2.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed whitespace-pre-line'>
                    {t('section2.card2.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section2.card2.image.src')}
                      alt={t('section2.card2.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: La Réaction de Maillard */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Flame className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section2.card3.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section2.card3.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed'>
                    {t('section2.card3.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section2.card3.image.src')}
                      alt={t('section2.card3.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Des Produits d'Exception */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background via-background-secondary to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-6'>
                {t('section3.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary leading-relaxed max-w-4xl mx-auto'>
                {t('section3.intro')}
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
              {/* Card 1: La Farine : Moulin Céard */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Wheat className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section3.card1.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section3.card1.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed whitespace-pre-line'>
                    {t('section3.card1.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section3.card1.image.src')}
                      alt={t('section3.card1.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: L'Héritage : Notre Savoir-Faire Charcutier */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <ChefHat className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section3.card2.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section3.card2.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed whitespace-pre-line'>
                    {t('section3.card2.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section3.card2.image.src')}
                      alt={t('section3.card2.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: L'Origine : Sourcing Italien AOP */}
              <Card className='bg-background-elevated border-border/50 hover:shadow-lg transition-shadow flex flex-col h-full'>
                <CardHeader>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <MapPin className='h-12 w-12 text-primary' />
                    </div>
                  </div>
                  <CardTitle className='text-xl font-bold text-foreground text-center mb-6'>
                    {t('section3.card3.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className='flex flex-col flex-grow'>
                  <h3 className='font-semibold text-foreground text-center mb-4'>
                    {t('section3.card3.step')}
                  </h3>
                  <p className='text-foreground-secondary leading-relaxed whitespace-pre-line'>
                    {t('section3.card3.content')}
                  </p>
                  <div className='mt-auto pt-4'>
                    <img
                      src={t('section3.card3.image.src')}
                      alt={t('section3.card3.image.alt')}
                      className='w-full h-48 object-cover rounded-lg'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Contact & Avis */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-6'>
                {t('section4.title')}
              </h2>
            </div>

            {/* Contact Section - Full Width */}
            <div className='mb-16'>
              <div className='text-center mb-8'>
                <div className='flex items-center justify-center gap-3 mb-4'>
                  <div className='p-2 bg-primary/10 rounded-full'>
                    <MessageCircle className='h-6 w-6 text-primary' />
                  </div>
                  <h3 className='text-2xl font-bold text-foreground'>
                    {t('section4.column1.title')}
                  </h3>
                </div>
                <p className='text-foreground-secondary max-w-2xl mx-auto'>
                  {t('section4.column1.subtitle')}
                </p>
              </div>

              {/* Contact Form */}
              <div className='max-w-2xl mx-auto'>
                <ContactFormSection />
              </div>
            </div>

            {/* Maps and Reviews - Side by Side */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
              {/* Google Maps */}
              <Card className='bg-background-elevated border-border/50'>
                <CardHeader>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-primary/10 rounded-full'>
                      <MapPin className='h-6 w-6 text-primary' />
                    </div>
                    <CardTitle className='text-xl font-bold text-foreground'>
                      {t('section4.column2.title')}
                    </CardTitle>
                  </div>
                  <p className='text-foreground-secondary'>
                    {t('section4.column2.subtitle')}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className='aspect-video rounded-lg overflow-hidden'>
                    <iframe
                      src='https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=275%20Avenue%20des%20Alli%C3%A9s,%2083240%20Cavalaire+(Darius%20Pizza)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed'
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      allowFullScreen
                      loading='lazy'
                      referrerPolicy='no-referrer-when-downgrade'
                      title='Darius Pizza'
                    />
                  </div>
                </CardContent>
              </Card>

              {/* TripAdvisor Widget */}
              <Card className='bg-background-elevated border-border/50'>
                <CardHeader>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-primary/10 rounded-full'>
                      <Star className='h-6 w-6 text-primary fill-primary' />
                    </div>
                    <CardTitle className='text-xl font-bold text-foreground'>
                      TripAdvisor
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='text-center space-y-6'>
                    {/* Coming Soon Message */}
                    <div className='py-8'>
                      <div className='flex justify-center mb-4'>
                        <div className='p-4 bg-primary/10 rounded-full'>
                          <Star className='h-12 w-12 text-primary' />
                        </div>
                      </div>
                      <h3 className='text-lg font-semibold text-foreground mb-2'>
                        {t('section4.tripadvisor.comingSoon')}
                      </h3>
                      <p className='text-foreground-secondary mb-6'>
                        {t('section4.tripadvisor.description')}
                      </p>
                      <a
                        href='https://www.tripadvisor.fr/Restaurant_Review-g666994-d23745036-Reviews-Darius_Pizza-Cavalaire_Sur_Mer_Var_Provence_Alpes_Cote_d_Azur.html'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-[#00af87] text-white rounded-lg hover:bg-[#009973] transition-colors font-medium'
                      >
                        <Star className='h-4 w-4' />
                        Voir tous les avis sur TripAdvisor
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Restez Connectés */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-background via-background-secondary to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-6xl mx-auto'>
            <div className='text-center mb-16'>
              <h2 className='text-3xl sm:text-4xl font-primary font-bold text-foreground mb-6'>
                {t('section5.title')}
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary leading-relaxed max-w-3xl mx-auto'>
                {t('section5.subtitle')}
              </p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
              {/* Instagram Feed */}
              <Card className='bg-background-elevated border-border/50'>
                <CardHeader>
                  <div className='flex items-center gap-3 mb-4'>
                    <div className='p-2 bg-primary/10 rounded-full'>
                      <Instagram className='h-6 w-6 text-primary' />
                    </div>
                    <CardTitle className='text-2xl font-bold text-foreground'>
                      {t('section5.instagram.title')}
                    </CardTitle>
                  </div>
                  <p className='text-foreground-secondary'>
                    {t('section5.instagram.description')}
                  </p>
                </CardHeader>
                <CardContent>
                  {/* Coming Soon Message */}
                  <div className='py-8 text-center'>
                    <div className='flex justify-center mb-4'>
                      <div className='p-4 bg-primary/10 rounded-full'>
                        <Instagram className='h-12 w-12 text-primary' />
                      </div>
                    </div>
                    <h3 className='text-lg font-semibold text-foreground mb-2'>
                      {t('section5.instagram.comingSoon')}
                    </h3>
                    <p className='text-foreground-secondary mb-6'>
                      {t('section5.instagram.comingSoonDescription')}
                    </p>
                    <a
                      href='https://instagram.com/dariuspizza'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium'
                    >
                      <Instagram className='h-4 w-4' />
                      {t('section5.instagram.followUs')}
                    </a>
                    <p className='mt-2 text-sm text-foreground-secondary'>
                      {t('section5.instagram.handle')}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <div className='space-y-6'>
                <Card className='bg-background-elevated border-border/50'>
                  <CardContent className='p-6'>
                    <div className='text-center space-y-4'>
                      <div className='p-4 bg-primary/10 rounded-full w-fit mx-auto'>
                        <Facebook className='h-12 w-12 text-primary' />
                      </div>
                      <h3 className='text-lg font-semibold text-foreground'>
                        {t('section5.social.comingSoon')}
                      </h3>
                      <p className='text-foreground-secondary mb-4'>
                        {t('section5.social.comingSoonDescription')}
                      </p>
                      <a
                        href={t('section5.social.facebookUrl')}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
                      >
                        <Facebook className='h-4 w-4' />
                        Suivre sur Facebook
                      </a>
                    </div>
                  </CardContent>
                </Card>

                <Card className='bg-background-elevated border-border/50'>
                  <CardContent className='p-6'>
                    <div className='text-center space-y-4'>
                      <div className='p-4 bg-primary/10 rounded-full w-fit mx-auto'>
                        <Phone className='h-12 w-12 text-primary' />
                      </div>
                      <h3 className='text-xl font-bold text-foreground'>
                        Contact Direct
                      </h3>
                      <p className='text-foreground-secondary'>
                        Appelez-nous directement pour vos commandes
                      </p>
                      <a
                        href='tel:+33946440511'
                        className='inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'
                      >
                        <Phone className='h-4 w-4' />
                        04.94.64.05.11
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
