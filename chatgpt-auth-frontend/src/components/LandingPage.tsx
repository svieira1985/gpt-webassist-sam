import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Zap, Bot } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-orange-50 to-orange-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#EB6625]/10 via-transparent to-[#EA6323]/10 dark:from-[#EB6625]/20 dark:via-transparent dark:to-[#EA6323]/20"></div>
      
      <div className="floating-shapes">
        <div className="shape shape-1 bg-gradient-to-br from-[#EB6625]/20 to-[#EA6323]/20"></div>
        <div className="shape shape-2 bg-gradient-to-br from-[#EA6323]/15 to-[#EB6625]/15"></div>
        <div className="shape shape-3 bg-gradient-to-br from-[#EB6625]/10 to-[#EA6323]/10"></div>
        <div className="shape shape-4 bg-gradient-to-br from-[#EA6323]/25 to-[#EB6625]/25"></div>
        <div className="shape shape-5 bg-gradient-to-br from-[#EB6625]/30 to-[#EA6323]/30"></div>
      </div>

      <div className="geometric-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="hero-content animate-fade-in-up">
          <div className="mb-8 relative">
            <div className="logo-glow absolute inset-0 bg-gradient-to-r from-[#EB6625] to-[#EA6323] rounded-2xl blur-xl opacity-30 animate-pulse-slow"></div>
            <img 
              src="/sam-logo.png" 
              alt="SAM AI" 
              className="w-40 md:w-48 h-24 md:h-28 rounded-2xl relative z-10 mx-auto shadow-2xl object-contain"
            />
          </div>

          <div className="mb-6">
            <div className="text-2xl md:text-4xl font-light text-gray-700 dark:text-gray-300 mb-2 animate-text-reveal-delay-1">
              Seu assistente de
            </div>
            <div className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white animate-text-reveal-delay-2">
              inteligência artificial
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed animate-text-reveal-delay-3">
            Potencialize sua produtividade com o poder da IA. 
            Converse, crie e inove com tecnologia de ponta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-text-reveal-delay-4">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-[#EB6625] to-[#EA6323] hover:from-[#EA6323] hover:to-[#EB6625] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
            >
              Começar agora
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-text-reveal-delay-5">
            <div className="feature-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EB6625] to-[#EA6323] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                IA Avançada
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Tecnologia GPT-4 para conversas naturais e respostas precisas
              </p>
            </div>

            <div className="feature-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EB6625] to-[#EA6323] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Respostas Rápidas
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Obtenha respostas instantâneas para suas perguntas e desafios
              </p>
            </div>

            <div className="feature-card bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EB6625] to-[#EA6323] rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Interface Intuitiva
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Design moderno e fácil de usar para máxima produtividade
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Footer positioned at bottom of page */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6">
        <div className="flex flex-col items-center justify-center animate-bounce-slow">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Desenvolvido pela Teddy Digital
          </div>
          <div className="w-6 h-6 border-2 border-[#EB6625] rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
