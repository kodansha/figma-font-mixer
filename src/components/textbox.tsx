import { h, JSX } from 'preact'
import styles from './textbox.module.css'

// create-figma-plugin標準のTextboxにはIME周りのバグがあるために、自前で作成したものを利用している。
export function Textbox(props: h.JSX.HTMLAttributes<HTMLInputElement>): JSX.Element {
  return (
    <div
      class={[
        styles.textbox,
        styles.hasBorder
      ].join(' ')}
    >
      <input type="text" {...props} class={styles.input} />
      <div class={styles.border} />
    </div>
  )
}