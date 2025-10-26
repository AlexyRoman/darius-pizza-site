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
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { TurnstileWidget } from '@/components/ui/turnstile';

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
  turnstileToken: z.string().min(1, {
    message: 'Please complete the verification.',
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactFormSection() {
  const t = useTranslations('info.contactForm');
  const [turnstileToken, setTurnstileToken] = React.useState<string>('');
  const [turnstileKey, setTurnstileKey] = React.useState(0); // For reset

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
      turnstileToken: '',
    },
  });

  // Update form with Turnstile token
  React.useEffect(() => {
    if (turnstileToken) {
      form.setValue('turnstileToken', turnstileToken);
    }
  }, [turnstileToken, form]);

  async function onSubmit(values: ContactFormValues) {
    const loadingToast = toast.loading(t('form.submit.sending'));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      // Success
      toast.success(t('form.successMessage'), {
        id: loadingToast,
        duration: 5000,
      });

      // Reset form and Turnstile
      form.reset();
      setTurnstileToken('');
      setTurnstileKey(prev => prev + 1); // Reset Turnstile widget
    } catch (error) {
      console.error('Error submitting form:', error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : t('form.errorMessage') || 'An error occurred. Please try again.';

      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
      });
    }
  }

  return (
    <section
      id='contact-form'
      className='py-16 lg:py-24 bg-background-secondary'
    >
      <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
        <div>
          {/* Email Banner */}
          <div className='mb-8'>
            <Card className='bg-primary/5 border-primary/20 shadow-lg'>
              <CardContent className='p-6 text-center'>
                <div className='flex items-center justify-center gap-3 mb-2'>
                  <Mail className='h-6 w-6 text-primary' />
                  <h3 className='text-xl font-primary font-semibold text-foreground'>
                    {t('emailBanner.title')}
                  </h3>
                </div>
                <p className='text-foreground-secondary mb-4'>
                  {t('emailBanner.description')}
                </p>
                <a
                  href={`mailto:${t('emailBanner.emailAddress')}`}
                  className='inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors'
                >
                  <Mail className='h-4 w-4' />
                  {t('emailBanner.emailAddress')}
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form - Full Width */}
          <div>
            <Card className='bg-background-elevated border-border/50 shadow-lg'>
              <CardHeader className='pb-4'>
                <CardTitle className='flex items-center gap-3 text-xl font-primary font-semibold text-foreground'>
                  <Send className='h-5 w-5 text-primary' />
                  {t('form.title')}
                </CardTitle>
                <p className='text-foreground-secondary'>
                  {t('form.description')}
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
                              {t('form.fields.name.label')} *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('form.fields.name.placeholder')}
                                {...field}
                              />
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
                              {t('form.fields.email.label')} *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('form.fields.email.placeholder')}
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
                              {t('form.fields.phone.label')}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t('form.fields.phone.placeholder')}
                                type='tel'
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              {t('form.fields.phone.description')}
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
                            <FormLabel>
                              {t('form.fields.subject.label')} *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t(
                                  'form.fields.subject.placeholder'
                                )}
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
                          <FormLabel>
                            {t('form.fields.inquiryType.label')} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'form.fields.inquiryType.placeholder'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='general'>
                                {t('form.fields.inquiryType.options.general')}
                              </SelectItem>
                              <SelectItem value='catering'>
                                {t('form.fields.inquiryType.options.catering')}
                              </SelectItem>
                              <SelectItem value='feedback'>
                                {t('form.fields.inquiryType.options.feedback')}
                              </SelectItem>
                              <SelectItem value='complaint'>
                                {t('form.fields.inquiryType.options.complaint')}
                              </SelectItem>
                              <SelectItem value='compliment'>
                                {t(
                                  'form.fields.inquiryType.options.compliment'
                                )}
                              </SelectItem>
                              <SelectItem value='employment'>
                                {t(
                                  'form.fields.inquiryType.options.employment'
                                )}
                              </SelectItem>
                              <SelectItem value='other'>
                                {t('form.fields.inquiryType.options.other')}
                              </SelectItem>
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
                          <FormLabel>
                            {t('form.fields.message.label')} *
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t('form.fields.message.placeholder')}
                              className='min-h-[120px]'
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('form.fields.message.description')}
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
                          <FormLabel>
                            {t('form.fields.preferredContact.label')}
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    'form.fields.preferredContact.placeholder'
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value='email'>
                                {t(
                                  'form.fields.preferredContact.options.email'
                                )}
                              </SelectItem>
                              <SelectItem value='phone'>
                                {t(
                                  'form.fields.preferredContact.options.phone'
                                )}
                              </SelectItem>
                              <SelectItem value='text'>
                                {t('form.fields.preferredContact.options.text')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t('form.fields.preferredContact.description')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Turnstile Verification */}
                    <div className='flex items-center justify-center py-4'>
                      <TurnstileWidget
                        key={turnstileKey}
                        onSuccess={token => setTurnstileToken(token)}
                        onError={() => setTurnstileToken('')}
                      />
                    </div>

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
                            {t('form.submit.sending')}
                          </>
                        ) : (
                          <>
                            <Send className='h-4 w-4 mr-2' />
                            {t('form.submit.sendMessage')}
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
