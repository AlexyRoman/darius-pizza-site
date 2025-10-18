'use client';

import React from 'react';
import { Mail, Send, User, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().optional(),
  subject: z.string().min(5, {
    message: 'Subject must be at least 5 characters.',
  }),
  inquiryType: z.string().min(1, {
    message: 'Please select an inquiry type.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }),
  preferredContact: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      inquiryType: '',
      message: '',
      preferredContact: 'email',
    },
  });

  function onSubmit(values: ContactFormValues) {
    // TODO: Implement actual form submission
    console.log('Form submitted:', values);

    // Show success message (you can implement a toast notification here)
    alert('Thank you for your message! We' + "'" + 'll get back to you soon.');

    // Reset form
    form.reset();
  }

  return (
    <section
      id='contact-form'
      className='py-16 lg:py-24 bg-gradient-to-b from-background-secondary via-background-secondary to-background'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Section Header */}
          <div className='text-center mb-12'>
            <h2 className='text-3xl sm:text-4xl lg:text-5xl font-primary font-bold text-foreground mb-4'>
              Get In Touch
            </h2>
            <p className='text-lg text-foreground-secondary font-secondary max-w-2xl mx-auto'>
              Have a question, feedback, or want to make a reservation? We{"'"}d
              love to hear from you. Send us a message and we{"'"}ll respond as
              soon as possible.
            </p>
          </div>

          {/* Email Banner */}
          <div className='mb-8'>
            <Card className='bg-primary/5 border-primary/20 shadow-lg'>
              <CardContent className='p-6 text-center'>
                <div className='flex items-center justify-center gap-3 mb-2'>
                  <Mail className='h-6 w-6 text-primary' />
                  <h3 className='text-xl font-primary font-semibold text-foreground'>
                    Email Us Directly
                  </h3>
                </div>
                <p className='text-foreground-secondary mb-4'>
                  Prefer to send an email directly? We{"'"}re here to help!
                </p>
                <a
                  href='mailto:info@dariuspizza.com'
                  className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors'
                >
                  <Mail className='h-4 w-4' />
                  info@dariuspizza.com
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Full Width */}
          <div className='max-w-4xl mx-auto'>
            <Card className='bg-background-elevated border-border/50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-xl font-primary font-semibold text-foreground'>
                  <Send className='h-5 w-5 text-primary' />
                  Send Us a Message
                </CardTitle>
                <p className='text-foreground-secondary'>
                  Fill out the form below and we{"'"}ll get back to you as soon
                  as possible.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-6'
                  >
                    {/* Name and Email Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <User className='h-4 w-4' />
                              Full Name *
                            </FormLabel>
                            <FormControl>
                              <Input placeholder='Your full name' {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Mail className='h-4 w-4' />
                              Email Address *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='your@email.com'
                                type='email'
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone and Subject Row */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className='flex items-center gap-2'>
                              <Phone className='h-4 w-4' />
                              Phone Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder='(123) 456-7890'
                                type='tel'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Optional - for urgent inquiries
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name='subject'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="What's this about?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Inquiry Type */}
                    <FormField
                      control={form.control}
                      name='inquiryType'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Inquiry *</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Select inquiry type' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='general'>
                                General Question
                              </SelectItem>
                              <SelectItem value='reservation'>
                                Table Reservation
                              </SelectItem>
                              <SelectItem value='catering'>
                                Catering Inquiry
                              </SelectItem>
                              <SelectItem value='feedback'>Feedback</SelectItem>
                              <SelectItem value='complaint'>
                                Complaint
                              </SelectItem>
                              <SelectItem value='compliment'>
                                Compliment
                              </SelectItem>
                              <SelectItem value='employment'>
                                Employment
                              </SelectItem>
                              <SelectItem value='other'>Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Message */}
                    <FormField
                      control={form.control}
                      name='message'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder='Tell us more about your inquiry...'
                              className='min-h-[120px]'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide as much detail as possible to help us
                            assist you better.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Preferred Contact Method */}
                    <FormField
                      control={form.control}
                      name='preferredContact'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Contact Method</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='How should we contact you?' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='email'>Email</SelectItem>
                              <SelectItem value='phone'>Phone Call</SelectItem>
                              <SelectItem value='text'>Text Message</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            We{"'"}ll use this method to respond to your
                            inquiry.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Submit Button */}
                    <div className='flex justify-end'>
                      <Button
                        type='submit'
                        size='lg'
                        className='min-w-[140px] !bg-primary !text-primary-foreground hover:!bg-primary active:!bg-primary focus:!bg-primary'
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2' />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className='h-4 w-4 mr-2' />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
