import { logo } from '../assets';

const Hero = () => {
  return (
    <header className='w-full flex justify-center items-center flex-col'>
        <nav className='flex justify-between items-center w-full mb-10 pt-3'>
            <img src={logo} alt='sumz_logo' className='w-28 object-contain' />
            <button
                type='button'
                onClick={() => window.open('https://github.com/Idemudia-Precious')}
                className='black_btn'
            >
                GitHub
            </button>
        </nav>

        <h1 className='head_text'>
            Summarize Articles & Websites with <br className='max-md:hidden' />
            <span className='orange_gradient'>OpenAI</span>
        </h1>
        <h2 className='desc'>
        "Streamline your reading experience using SummarEase, an open-source article summarization tool that converts extensive articles into succinct and easy-to-digest summaries."
        </h2>
    </header>
  )
}

export default Hero