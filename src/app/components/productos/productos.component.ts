import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Producto } from '../../models/producto.model';
import { CommonModule } from '@angular/common';
import { FiltroCategoriaPipe } from '../../pipes/filtro-categoria.pipe';
import { filter } from 'rxjs/operators';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import Swal from 'sweetalert2';

declare var paypal: any;

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements AfterViewInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  productos: Producto[] = [
    // 8 Proteínas (Gymshark, YoungLA, Optimum Nutrition, Myprotein)
    { id: 1, nombre: 'Gymshark Whey Protein', descripcion: 'Proteína de suero premium Gymshark', precio: 1, imagen: 'https://m.media-amazon.com/images/I/51+1dK5TL6L._AC_SX679_.jpg', categoria: 'proteina' },
    { id: 2, nombre: 'YoungLA Protein Blend', descripcion: 'Mezcla de proteínas YoungLA sabor chocolate', precio: 1400, imagen: 'https://suplementosmty.com/cdn/shop/files/IMG-4793.jpg?v=1702078683', categoria: 'proteina' },
    { id: 3, nombre: 'Optimum Nutrition Gold Standard 100% Whey', descripcion: 'Proteína clásica con gran reputación', precio: 1600, imagen: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Folimpofitness.net%2Fproducto%2Fproteina-raw-bum-whey-blend-69-servidas%2F&psig=AOvVaw1Kw3Zh1ssbVNk-3KkP3Cco&ust=1750576815531000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCHufz8gY4DFQAAAAAdAAAAABAK', categoria: 'proteina' },
    { id: 4, nombre: 'Myprotein Impact Whey Protein', descripcion: 'Alta calidad y sabor', precio: 1300, imagen: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.ubuy.com.ph%2Fproduct%2FFZFHU5GAW-cbum-series-itholate-protein-powder-strawberry-bumcake-1-64-lbs-25-servings&psig=AOvVaw1Kw3Zh1ssbVNk-3KkP3Cco&ust=1750576815531000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCHufz8gY4DFQAAAAAdAAAAABAT', categoria: 'proteina' },
    { id: 5, nombre: 'Gymshark Vegan Protein', descripcion: 'Proteína vegetal premium Gymshark', precio: 1550, imagen: 'https://cdn.shopify.com/s/files/1/0230/1569/products/gymshark-vegan-protein-chocolate_1200x1200.jpg?v=1631782248', categoria: 'proteina' },
    { id: 6, nombre: 'Dymatize ISO100 Hydrolyzed', descripcion: 'Proteína hidrolizada ultra pura', precio: 1800, imagen: 'https://images.dynamite.com/dymatize-iso-100-whey-protein-hydrolyzed-5lb-vanilla-ice-cream-270g.jpg', categoria: 'proteina' },
    { id: 7, nombre: 'YoungLA Classic Protein', descripcion: 'Proteína sabor vainilla', precio: 1400, imagen: 'https://cdn.shopify.com/s/files/1/0537/4689/5709/products/youngla-protein-vanilla-2_1200x1200.jpg?v=1658995591', categoria: 'proteina' },
    { id: 8, nombre: 'BSN Syntha-6 Protein', descripcion: 'Mezcla de proteínas con sabor', precio: 1500, imagen: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Frolos.cl%2Fproteina-whey-y-como-utilizarla%2F&psig=AOvVaw0ODHaULsQGUA9qn4ripJiw&ust=1750576897163000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNjNp6P9gY4DFQAAAAAdAAAAABAE', categoria: 'proteina' },

    // 8 Creatinas (Optimum, MuscleTech, Myprotein, Cellucor)
    { id: 9, nombre: 'Optimum Nutrition Micronized Creatine', descripcion: 'Creatina monohidrato micronizada', precio: 550, imagen: 'https://images-na.ssl-images-amazon.com/images/I/81osJUff0ML._SL1500_.jpg', categoria: 'creatina' },
    { id: 10, nombre: 'MuscleTech Platinum Creatine', descripcion: 'Creatina pura para potencia', precio: 600, imagen: 'https://cdn.muscletech.com/products/platinum-creatine/large/10004997.jpg', categoria: 'creatina' },
    { id: 11, nombre: 'Myprotein Creatina Monohidrato', descripcion: 'Creatina de alta calidad', precio: 520, imagen: 'https://cdn.myprotein.com/images/products/30333/30333-02.jpg', categoria: 'creatina' },
    { id: 12, nombre: 'Cellucor Cor-Performance Creatine', descripcion: 'Apoya fuerza y recuperación', precio: 580, imagen: 'https://cdn.cellucor.com/media/catalog/product/cache/2/image/600x600/9df78eab33525d08d6e5fb8d27136e95/c/o/cor-perform-creatine-large_2.png', categoria: 'creatina' },
    { id: 13, nombre: 'Creatina Creapure', descripcion: 'Alta pureza alemana', precio: 650, imagen: 'https://cdn.shopify.com/s/files/1/0271/8635/0057/products/creapure_creatine_600x.jpg?v=1625615063', categoria: 'creatina' },
    { id: 14, nombre: 'Universal Nutrition Creatine', descripcion: 'Fuerza y resistencia', precio: 560, imagen: 'https://cdn.universalnutrition.com/products/creatine-480g.png', categoria: 'creatina' },
    { id: 15, nombre: 'Kaged Muscle Creatine HCl', descripcion: 'Creatina HCl de alta absorción', precio: 700, imagen: 'https://cdn.kagedmuscle.com/wp-content/uploads/2021/03/Kaged-Muscle-Creatine-HCl-Powder-300x300.png', categoria: 'creatina' },
    { id: 16, nombre: 'Optimum Nutrition Creatine Capsules', descripcion: 'Creatina en cápsulas', precio: 750, imagen: 'https://images-na.ssl-images-amazon.com/images/I/71rbSP2gGOL._SL1500_.jpg', categoria: 'creatina' },

    // 8 Pre-entrenos (C4, Legion Pulse, Optimum, Ghost)
    { id: 17, nombre: 'Cellucor C4 Original', descripcion: 'Pre-entreno popular y efectivo', precio: 800, imagen: 'https://cdn.cellucor.com/media/catalog/product/cache/2/image/600x600/9df78eab33525d08d6e5fb8d27136e95/c/4/c4-original-pre-workout-large.png', categoria: 'preentreno' },
    { id: 18, nombre: 'Legion Pulse', descripcion: 'Pre-entreno con ingredientes naturales', precio: 950, imagen: 'https://legionathletics.com/wp-content/uploads/2021/02/pulse-v2-1.png', categoria: 'preentreno' },
    { id: 19, nombre: 'Optimum Nutrition Gold Pre-Workout', descripcion: 'Foco y energía', precio: 900, imagen: 'https://images-na.ssl-images-amazon.com/images/I/71TTjyfZDaL._SL1500_.jpg', categoria: 'preentreno' },
    { id: 20, nombre: 'Ghost Legend', descripcion: 'Pre-entreno con sabor', precio: 1000, imagen: 'https://ghostlifestyle.com/media/catalog/product/cache/0f872144feae9d3c78d4175705e36ef9/g/h/ghost_legend_20_servings.jpg', categoria: 'preentreno' },
    { id: 21, nombre: 'BSN N.O.-Xplode', descripcion: 'Explosivo y duradero', precio: 850, imagen: 'https://cdn.bsn.com/media/catalog/product/cache/1/image/1200x675/9df78eab33525d08d6e5fb8d27136e95/n/o/no-xplode_3.jpg', categoria: 'preentreno' },
    { id: 22, nombre: 'Kaged Muscle Pre-Kaged', descripcion: 'Foco y resistencia', precio: 920, imagen: 'https://cdn.kagedmuscle.com/wp-content/uploads/2020/01/Pre-Kaged-Supplement-Bottle.png', categoria: 'preentreno' },
    { id: 23, nombre: 'MuscleTech VaporX5', descripcion: 'Pre-entreno clásico', precio: 870, imagen: 'https://cdn.muscletech.com/products/vaporx5-next-gen/large/10004656.jpg', categoria: 'preentreno' },
    { id: 24, nombre: 'Redcon1 Total War', descripcion: 'Pre-entreno potente', precio: 980, imagen: 'https://cdn.redcon1.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/t/o/totalwar_1.png', categoria: 'preentreno' },

    // 6 Accesorios (straps, guantes, cinturones)
    { id: 25, nombre: 'Gymshark Straps', descripcion: 'Straps para levantamiento', precio: 300, imagen: 'https://cdn.shopify.com/s/files/1/0270/5862/products/Gymshark_Straps_Black_1024x1024.jpg', categoria: 'accesorio' },
    { id: 26, nombre: 'YoungLA Guantes de Entrenamiento', descripcion: 'Guantes para pesas', precio: 350, imagen: 'https://cdn.shopify.com/s/files/1/0537/4689/5709/products/youngla-gloves-black_1200x1200.jpg', categoria: 'accesorio' },
    { id: 27, nombre: 'Cinturón de levantamiento', descripcion: 'Soporte lumbar', precio: 400, imagen: 'https://cdn.shopify.com/s/files/1/0026/1020/3510/products/weightlifting-belt-5d48d770-5bd7-448b-a4d9-ea5f3f3a92a0_1200x.jpg', categoria: 'accesorio' },
    { id: 28, nombre: 'Rodilleras deportivas', descripcion: 'Protección para rodillas', precio: 280, imagen: 'https://cdn.shopify.com/s/files/1/0557/7309/6814/products/therapro-knee-sleeve_1200x1200.jpg', categoria: 'accesorio' },
    { id: 29, nombre: 'Cuerda para saltar', descripcion: 'Ideal para cardio', precio: 150, imagen: 'https://cdn.shopify.com/s/files/1/0587/5484/4593/products/fitness-jump-rope-adjustable-weighted-rope-1668698402285_1200x1200.jpg', categoria: 'accesorio' },
    { id: 30, nombre: 'Toalla deportiva Gymshark', descripcion: 'Absorbe sudor', precio: 200, imagen: 'https://cdn.shopify.com/s/files/1/0230/1569/products/gymshark-towel-black_1200x1200.jpg', categoria: 'accesorio' },

    // 10 Ropa (Gymshark, YoungLA, Nike, Adidas)
    { id: 31, nombre: 'Camiseta Gymshark Training', descripcion: 'Camiseta técnica', precio: 900, imagen: 'https://cdn.shopify.com/s/files/1/0230/1569/products/gymshark-training-tshirt-black_1200x1200.jpg', categoria: 'ropa' },
    { id: 32, nombre: 'Shorts YoungLA', descripcion: 'Shorts deportivos cómodos', precio: 850, imagen: 'https://cdn.shopify.com/s/files/1/0537/4689/5709/products/youngla-shorts-black_1200x1200.jpg', categoria: 'ropa' },
    { id: 33, nombre: 'Sudadera Nike Dri-FIT', descripcion: 'Sudadera ligera', precio: 1200, imagen: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/12345678-90ab-cdef-1234-567890abcdef/sudadera-nike-dri-fit.jpg', categoria: 'ropa' },
    { id: 34, nombre: 'Pantalón Adidas Training', descripcion: 'Pantalón para entrenamiento', precio: 1100, imagen: 'https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/abcd1234/pantalon-training-negro.jpg', categoria: 'ropa' },
    { id: 35, nombre: 'Tank Top Gymshark', descripcion: 'Sin mangas para entrenar', precio: 750, imagen: 'https://cdn.shopify.com/s/files/1/0230/1569/products/gymshark-tank-top-black_1200x1200.jpg', categoria: 'ropa' },
    { id: 36, nombre: 'Joggers YoungLA', descripcion: 'Joggers cómodos y estilizados', precio: 1000, imagen: 'https://cdn.shopify.com/s/files/1/0537/4689/5709/products/youngla-joggers-black_1200x1200.jpg', categoria: 'ropa' },
    { id: 37, nombre: 'Sudadera con capucha Nike', descripcion: 'Para días fríos', precio: 1300, imagen: 'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/abcdef12-3456-7890-abcd-ef1234567890/sudadera-con-capucha.jpg', categoria: 'ropa' },
    { id: 38, nombre: 'Camiseta Adidas Climalite', descripcion: 'Tecnología para mantenerte fresco', precio: 900, imagen: 'https://assets.adidas.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy/abcd5678/camiseta-climalite.jpg', categoria: 'ropa' },
    { id: 39, nombre: 'Pantalones cortos Under Armour', descripcion: 'Comodidad y rendimiento', precio: 850, imagen: 'https://underarmour.scene7.com/is/image/Underarmour/shorts-ua-black-01?$pdpflexfurniturerev2$', categoria: 'ropa' },
    { id: 40, nombre: 'Chaqueta deportiva YoungLA', descripcion: 'Estilo y confort', precio: 1400, imagen: 'https://cdn.shopify.com/s/files/1/0537/4689/5709/products/youngla-jacket-black_1200x1200.jpg', categoria: 'ropa' },
  ];


  carrito: Producto[] = [];
  total: number = 0;

  ngAfterViewInit() {
    // Scroll si hay fragmento en la URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const fragment = this.route.snapshot.fragment;
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
      this.renderPayPalButton(); // ✅ Se asegura de renderizar si se cambia de ruta
    });

    this.renderPayPalButton(); // ✅ Render inicial
  }

  agregarAlCarrito(producto: Producto) {
    this.carrito.push(producto);
    this.calcularTotal();
    this.renderPayPalButton(); // ✅ Re-render después de cambios
  }

  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
    this.renderPayPalButton(); // ✅ Re-render después de cambios
  }

  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + item.precio, 0);
  }

  renderPayPalButton() {
    const container = document.getElementById('paypal-button-container');
    if (this.carrito.length === 0 || !container) return;

    container.innerHTML = ''; // Limpia antes de volver a renderizar

    paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.total.toFixed(2)
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          Swal.fire({
            title: '¡Pago exitoso!',
            text: `Gracias ${details.payer.name.given_name} por tu compra.`,
            icon: 'success',
            confirmButtonColor: '#ff6f00',
            confirmButtonText: 'Continuar'
          });
          this.carrito = [];
          this.total = 0;
          this.renderPayPalButton();
        });
      }
      ,
      onError: (err: any) => {
        console.error('Error en el pago:', err);
        Swal.fire({
          title: '¡Error en el pago!',
          text: 'Ocurrió un problema al procesar el pago. Por favor intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#d33',
          confirmButtonText: 'Aceptar'
        });
      }

    }).render('#paypal-button-container');
  }

  // Getters por categoría
  get proteinas() {
    return this.productos.filter(p => p.categoria === 'proteina');
  }

  get creatinas() {
    return this.productos.filter(p => p.categoria === 'creatina');
  }

  get preentrenos() {
    return this.productos.filter(p => p.categoria === 'preentreno');
  }

  get accesorios() {
    return this.productos.filter(p => p.categoria === 'accesorio');
  }

  get ropa() {
    return this.productos.filter(p => p.categoria === 'ropa');
  }
}
