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

export default function InfoPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-background to-background-secondary'>
      {/* Hero Section */}
      <section className='py-16 lg:py-24 bg-gradient-to-b from-primary/5 via-accent/5 to-background-secondary'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              <Heart className='h-8 w-8 text-primary fill-primary' />
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-primary font-bold text-foreground'>
                About Darius Pizza
              </h1>
              <Heart className='h-8 w-8 text-primary fill-primary' />
            </div>
            <p className='text-xl text-foreground-secondary font-secondary leading-relaxed max-w-3xl mx-auto'>
              Discover the story behind our authentic Italian pizzeria, where
              tradition meets passion and every pizza tells a tale of family
              heritage and culinary excellence.
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
                    Our Heritage
                  </h2>
                  <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                    Founded in 1985 by Giuseppe Darius, our pizzeria began as a
                    small family dream to bring authentic Italian flavors to our
                    community. What started as a modest kitchen has grown into a
                    beloved local institution, but our commitment to traditional
                    recipes and family values remains unchanged.
                  </p>
                  <p className='text-lg text-foreground-secondary font-secondary leading-relaxed'>
                    Today, three generations of the Darius family continue to
                    craft each pizza with the same passion and attention to
                    detail that Giuseppe brought from his hometown in Naples,
                    Italy.
                  </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                  <Card className='bg-background-elevated border-border/50'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <ChefHat className='h-6 w-6 text-primary' />
                        <h3 className='font-semibold text-foreground'>
                          Traditional Recipes
                        </h3>
                      </div>
                      <p className='text-sm text-foreground-secondary'>
                        Authentic Neapolitan techniques passed down through
                        generations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className='bg-background-elevated border-border/50'>
                    <CardContent className='p-6'>
                      <div className='flex items-center gap-3 mb-3'>
                        <Wheat className='h-6 w-6 text-primary' />
                        <h3 className='font-semibold text-foreground'>
                          Fresh Ingredients
                        </h3>
                      </div>
                      <p className='text-sm text-foreground-secondary'>
                        Locally sourced produce and imported Italian specialties
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
                        src='https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
                        alt='Traditional Italian kitchen with family preparing pizza'
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

                      <div className='absolute bottom-6 left-6'>
                        <Badge className='bg-background/90 backdrop-blur-sm border border-border/50 text-foreground'>
                          <Award className='h-4 w-4 mr-2 text-primary' />
                          Family Owned Since 1985
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
                Our Values
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary max-w-2xl mx-auto'>
                The principles that guide everything we do, from ingredient
                selection to customer service.
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
                    Passion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    Every pizza is made with genuine love for the craft and
                    respect for Italian tradition.
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
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    We{"'"}re proud to be part of our local community, serving
                    neighbors and friends for decades.
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
                    Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-foreground-secondary'>
                    We never compromise on quality, using only the finest
                    ingredients and traditional methods.
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
                Visit Us Today
              </h2>
              <p className='text-lg text-foreground-secondary font-secondary'>
                We{"'"}d love to welcome you to our family restaurant and share
                our passion for authentic Italian pizza.
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
                    Location
                  </h3>
                  <p className='text-sm text-foreground-secondary'>
                    123 Main Street
                    <br />
                    Downtown District
                    <br />
                    City, State 12345
                  </p>
                </CardContent>
              </Card>

              <Card className='text-center bg-background-elevated border-border/50'>
                <CardContent className='p-6'>
                  <div className='flex justify-center mb-4'>
                    <div className='p-3 bg-primary/10 rounded-full'>
                      <Clock className='h-6 w-6 text-primary' />
                    </div>
                  </div>
                  <h3 className='font-semibold text-foreground mb-2'>Hours</h3>
                  <p className='text-sm text-foreground-secondary'>
                    Mon-Thu: 11am-10pm
                    <br />
                    Fri-Sat: 11am-11pm
                    <br />
                    Sunday: 12pm-9pm
                  </p>
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
                    Contact
                  </h3>
                  <p className='text-sm text-foreground-secondary'>
                    (555) 123-4567
                    <br />
                    info@dariuspizza.com
                    <br />
                    Reservations welcome
                  </p>
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
