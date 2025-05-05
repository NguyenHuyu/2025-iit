'use client'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import Link from 'next/link'
import type { BaseEntity } from '@/components/entry'
import { ActionConfig } from './types'

interface ActionButtonProps<T extends BaseEntity = BaseEntity> {
  config: ActionConfig<T>
  item?: T
}

export function ActionButton<T extends BaseEntity = BaseEntity>({
  config,
  item
}: ActionButtonProps<T>) {
  const {
    icon,
    label,
    tooltip,
    variant = 'ghost',
    size = 'icon',
    disabled = false,
    hidden = false,
    onClick,
    href,
    className = ''
  } = config

  // Check if action should be hidden
  const isHidden = typeof hidden === 'function' ? hidden(item) : hidden
  if (isHidden) return null

  // Check if action should be disabled
  const isDisabled = typeof disabled === 'function' ? disabled(item) : disabled

  // Determine if this is a link action
  const isLink = typeof href === 'string' || typeof href === 'function'
  const linkHref = typeof href === 'function' ? href(item) : href

  const buttonContent = (
    <>
      {icon}
      {label && (size !== 'icon' || !icon) && (
        <span className={icon ? 'ml-2' : ''}>{label}</span>
      )}
    </>
  )

  const buttonProps = {
    variant,
    size,
    disabled: isDisabled,
    className,
    onClick: isLink ? undefined : () => onClick(item)
  }

  const renderButton = () => {
    if (isLink && linkHref) {
      return (
        <Button asChild {...buttonProps}>
          <Link href={linkHref}>{buttonContent}</Link>
        </Button>
      )
    }

    return (
      <Button {...buttonProps} onClick={() => onClick(item)}>
        {buttonContent}
      </Button>
    )
  }

  if (tooltip) {
    return (
      <TooltipProvider delayDuration={1}>
        <Tooltip>
          <TooltipTrigger asChild>{renderButton()}</TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return renderButton()
}
