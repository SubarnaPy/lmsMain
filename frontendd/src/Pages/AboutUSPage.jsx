
import HighlightText from '../Components/HomePage/HighlightText';
import BannerImage1 from "../Assetss/Images/aboutus1.webp"
import BannerImage2 from "../Assetss/Images/aboutus2.webp"
import BannerImage3 from "../Assetss/Images/aboutus3.webp"
import Quote from "../Components/AboutPage/Quote"
import FoundingStory from "../Assetss/Images/FoundingStory.png"
import StatsComponent from '../Components/AboutPage/Stats'
import LearningGrid from '../Components/AboutPage/LearningGrid'
import ContactFormSection from '../Components/AboutPage/ContactFormSection'
import HomeLayout from "../Layouts/HomeLayout"

//import RatingSlider from '../Components/Ratings/RatingSlider';

const AboutUs = () => {
  return (

    <HomeLayout>
    
    <div className='mx-auto text-white bg-teal-950'>
      {/* section 1 */}
      <section className='bg-richblack-700'>
        <div className='relative flex flex-col justify-between w-11/12 gap-10 mx-auto text-center text-white max-w-maxContent'>
            <header className='mx-auto py-20 text-4xl font-semibold lg:w-[70%]'>
                Driving Innovation in Online Education for a 
                <HighlightText text={"Brighter Future"}/>
                <p className='mx-auto mt-3 text-center text-base font-medium text-richblack-300 lg:w-[95%]'>Studynotion is at the forefront of driving innovation in online education. We are passionate about creating a brighter future by offering cutting-edge courses, leveraging emerging technologies, and nurturing a vibrant learning community.</p>
            </header>
            <div className='sm:h-[70px] lg:h-[150px]'></div>
            <div className='absolute bottom-0 left-[50%] grid w-[100%] translate-x-[-50%] translate-y-[30%] grid-cols-3 gap-3 lg:gap-5'>
                <img src={BannerImage1} />
                <img src={BannerImage2} />
                <img src={BannerImage3} />
            </div>
        </div>
      </section>

      {/* section 2 */}

      <section className='border-b border-richblack-700'>
        <div className='flex flex-col justify-between w-11/12 gap-10 mx-auto max-w-maxContent text-richblack-500'>
          <div className='h-[100px] '></div>
            <Quote/>
        </div>
      </section>


      {/* section 3 */}

      <section>
        <div className='flex flex-col justify-between w-11/12 gap-10 mx-auto max-w-maxContent text-richblack-500'>
            {/* foudning story wala div */}
            <div className='flex flex-col items-center justify-between gap-10 lg:flex-row '>
                {/* founding story left box */}
                <div className='my-24 flex lg:w-[50%] flex-col gap-10'>
                    <h1 className='bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>Our Founding Story</h1>

                    <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>Our e-learning platform was born out of a shared vision and passion for transforming education. It all began with a group of educators, technologists, and lifelong learners who recognized the need for accessible, flexible, and high-quality learning opportunities in a rapidly evolving digital world.</p>

                    <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>As experienced educators ourselves, we witnessed firsthand the limitations and challenges of traditional education systems. We believed that education should not be confined to the walls of a classroom or restricted by geographical boundaries. We envisioned a platform that could bridge these gaps and empower individuals from all walks of life to unlock their full potential.</p>
                </div>
                {/* foudning story right box */}
                <div>
                    <img className='shadow-[0_0_20px_0] shadow-[#FC6767]'  src={FoundingStory} />
                </div>
            </div>

            {/* vision and mission wala parent div */}
            <div className='flex flex-col items-center justify-between lg:gap-10 lg:flex-row'>
                {/* left box */}
                <div className='my-24 flex lg:w-[40%] flex-col gap-10'>
                    <h1 className='bg-gradient-to-b from-[#FF512F] to-[#F09819] bg-clip-text text-4xl font-semibold text-transparent lg:w-[70%] '>Our Vision</h1>
                    <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>With this vision in mind, we set out on a journey to create an e-learning platform that would revolutionize the way people learn. Our team of dedicated experts worked tirelessly to develop a robust and intuitive platform that combines cutting-edge technology with engaging content, fostering a dynamic and interactive learning experience.</p>
                </div>

                {/* right box */}
                <div className='my-24 flex lg:w-[40%] flex-col gap-10'>
                    <h1 className='bg-gradient-to-b from-[#1FA2FF] via-[#12D8FA] to-[#A6FFCB] text-transparent bg-clip-text text-4xl font-semibold lg:w-[70%] '>
                        Our Mission
                    </h1>
                    <p className='text-base font-medium text-richblack-300 lg:w-[95%]'>Our mission goes beyond just delivering courses online. We wanted to create a vibrant community of learners, where individuals can connect, collaborate, and learn from one another. We believe that knowledge thrives in an environment of sharing and dialogue, and we foster this spirit of collaboration through forums, live sessions, and networking opportunities.</p>
                </div>
            </div>
        </div>
      </section>  

      {/* section 4 */}
      <StatsComponent/>  
      
      {/* section 5 */}
      <section className='mx-auto p-2 flex flex-col items-center justify-between gap-5 mb-[140px]'>
        <LearningGrid />
        <ContactFormSection />
      </section>

      <section>
      <div className='w-screen mt-3  '>
        <h2 className='mt-8 text-4xl font-semibold text-center text-richblack-5'>Reviews from other learners</h2>
        {/* <RatingSlider /> */}
      </div>
      </section>

    </div>
    </HomeLayout>
  )
}

export default AboutUs;