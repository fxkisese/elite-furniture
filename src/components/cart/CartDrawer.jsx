import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/lib/CartContext';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Minus, Plus, Trash2, ShoppingCart, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { formatCartForWhatsApp } from '@/utils/whatsapp';

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '254793816450';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    const message = formatCartForWhatsApp(cartItems, cartTotal);
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${encodedMessage}`, '_blank');
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-white border-l border-gray-200 p-0">
        <SheetHeader className="p-6 border-b border-gray-100">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingCart className="w-5 h-5 text-[#C8A570]" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingCart className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-sm text-gray-500 mb-6">Looks like you haven't added any items yet.</p>
            <Button 
              onClick={() => setIsCartOpen(false)}
              className="bg-black hover:bg-gray-800 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-6">
              <div className="flex flex-col gap-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0 border border-gray-200">
                      {item.imageUrl || item.image ? (
                        <img 
                          src={item.imageUrl || item.image} 
                          alt={item.title || item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 bg-gray-50">
                          No Img
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                            {item.title || item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center gap-3 border border-gray-200 rounded-md p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-4 text-center">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-sm">
                          {formatPrice((item.price || 0) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Delivery fees calculated at checkout.
              </p>
              <Button 
                onClick={handleCheckout}
                className="w-full bg-[#0A0A0A] hover:bg-[#D4AF37] hover:text-[#0A0A0A] text-white font-bold h-12 text-base shadow-sm mb-2 transition-colors"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
              <div className="flex gap-2">
                <Button 
                  onClick={handleWhatsAppCheckout}
                  variant="outline"
                  className="flex-1 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold h-10 text-xs transition-colors px-2"
                >
                  Order via WhatsApp
                </Button>
                <Button 
                  onClick={async () => {
                    try {
                      const { generateInvoicePDF } = await import('@/utils/invoiceGenerator');
                      await generateInvoicePDF({ order_number: 'CART-INQUIRY' }, cartItems);
                    } catch (err) {
                      console.error("PDF Error:", err);
                      import('sonner').then(({ toast }) => toast.error("Failed to download invoice."));
                    }
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold h-10 text-xs transition-colors px-2"
                >
                  Download Invoice
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

