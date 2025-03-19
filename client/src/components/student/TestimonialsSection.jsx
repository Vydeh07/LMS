import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialsSection = () => {
  return (
    <div className='py-16 px-8 md:px-16 lg:px-24 bg-gradient-to-b from-white to-gray-50'>
        <h2 className='text-3xl md:text-4xl font-semibold text-gray-800 text-center'>Testimonials</h2>
        <p className='md:text-base text-gray-600 mt-3 max-w-3xl mx-auto text-center'>Hear from our learners as they share their journeys of transformation, success, and how our platform has made a difference in their lives.</p>
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14'>
      {dummyTestimonial.map((testimonial,index)=>(
        <div key={index} className='text-sm text-left border border-gray-200 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden max-w-xs mx-auto h-96'>
          <div className='flex items-center gap-4 px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100'>
            <img className='h-14 w-14 rounded-full object-cover ring-2 ring-indigo-100 shadow-md' src={testimonial.image} alt={testimonial.name}/>
            <div>
              <h1 className='text-lg font-semibold text-gray-800'>{testimonial.name}</h1>
              <p className='text-gray-600'>{testimonial.role}</p>
            </div>
          </div>
          
          <div className='p-6'> 
            <div className='flex gap-1'>
              {[...Array(5)].map((_,i)=>(
                <img className='h-5 w-5' key={i} src={i<Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star"/>
              ))}
            </div>
            <p className='text-gray-600 mt-5 leading-relaxed line-clamp-4'>{testimonial.feedback}</p>
          </div>
          
          <div className='px-6 pb-4 mt-auto'>
            <a href="#" className='text-blue-600 hover:text-blue-800 font-medium'>Read more</a>
          </div>
        </div>
      ))}
    </div>
    </div>
  )
}

export default TestimonialsSection