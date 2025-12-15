# CustomButton - Guía de Uso

El componente `CustomButton` ahora soporta múltiples efectos visuales, iconos duales y colores personalizables.

## Nuevas Características

### 1. Múltiples Efectos
Ahora puedes elegir entre 6 efectos diferentes:
- `expandIcon` - El ícono se expande al hacer hover
- `shimmer` - Efecto de brillo que se desliza
- `ripple` - Efecto de ondas al hacer click
- `glow` - Resplandor al hacer hover
- `slide` - Fondo que se desliza
- `bounce` - Rebote al hacer hover/click
- `none` - Sin efecto especial (default)

### 2. Iconos Duales
Ahora puedes usar `leftIcon` y `rightIcon` simultáneamente:

```tsx
<CustomButton 
  leftIcon={ShoppingCart} 
  rightIcon={ArrowRight}
>
  Comprar Ahora
</CustomButton>
```

### 3. Colores Personalizables
Personaliza los colores de los efectos con `effectColor` y `effectAccentColor`:

```tsx
<CustomButton 
  effect="expandIcon"
  effectColor="bg-amber-800/80"
  effectAccentColor="text-white"
>
  Mi Botón
</CustomButton>
```

## Ejemplos de Uso

### Efecto ExpandIcon con Colores Personalizados
```tsx
<CustomButton
  to="/productos"
  effect="expandIcon"
  filledIcon
  effectColor="bg-amber-800/80 dark:bg-amber-700"
  effectAccentColor="text-slate-300 dark:text-black"
  className="bg-black/80 dark:bg-white/70"
>
  Explorar Productos
</CustomButton>
```

### Efecto Shimmer
```tsx
<CustomButton
  effect="shimmer"
  effectColor="rgba(255, 215, 0, 0.4)"
  leftIcon={Star}
>
  Destacado
</CustomButton>
```

### Efecto Ripple
```tsx
<CustomButton
  effect="ripple"
  effectColor="rgba(59, 130, 246, 0.6)"
  onClick={handleClick}
>
  Click Me
</CustomButton>
```

### Efecto Glow
```tsx
<CustomButton
  effect="glow"
  effectColor="rgba(168, 85, 247, 0.5)"
  leftIcon={Sparkles}
>
  Premium
</CustomButton>
```

### Efecto Slide
```tsx
<CustomButton
  effect="slide"
  effectColor="rgba(34, 197, 94, 0.2)"
  rightIcon={ArrowRight}
>
  Continuar
</CustomButton>
```

### Efecto Bounce
```tsx
<CustomButton
  effect="bounce"
  leftIcon={Heart}
  rightIcon={Heart}
>
  Me Gusta
</CustomButton>
```

### Iconos Duales
```tsx
<CustomButton
  leftIcon={ShoppingCart}
  rightIcon={ChevronRight}
  effect="none"
>
  Ir al Carrito
</CustomButton>
```

## Props Disponibles

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `effect` | `ButtonEffect` | `"none"` | Tipo de efecto visual |
| `leftIcon` | `LucideIcon` | - | Ícono en el lado izquierdo |
| `rightIcon` | `LucideIcon` | - | Ícono en el lado derecho |
| `effectColor` | `string` | - | Color CSS para el efecto |
| `effectAccentColor` | `string` | - | Color de acento para el efecto |
| `size` | `"sm" \| "md" \| "lg" \| "icon"` | `"md"` | Tamaño del botón |
| `to` | `string` | - | Ruta para navegación (Link) |
| `filledIcon` | `boolean` | `false` | Usar ícono relleno (expandIcon) |

## Backward Compatibility

Las props antiguas `icon` e `iconPlacement` siguen funcionando pero están marcadas como deprecated. Se recomienda usar `leftIcon` o `rightIcon` en su lugar.

```tsx
// ❌ Antiguo (deprecated)
<CustomButton icon={Star} iconPlacement="right">
  Botón
</CustomButton>

// ✅ Nuevo (recomendado)
<CustomButton rightIcon={Star}>
  Botón
</CustomButton>
```
