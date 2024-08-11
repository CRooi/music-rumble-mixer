import { ICON_TYPES } from '@elastic/eui'
import { ValuesType } from 'utility-types'

import { appendIconComponentCache } from '@elastic/eui/es/components/icon/icon'

import { icon as popout } from '@elastic/eui/es/components/icon/assets/popout'
import { icon as lock } from '@elastic/eui/es/components/icon/assets/lock'
import { icon as user } from '@elastic/eui/es/components/icon/assets/user'
import { icon as error } from '@elastic/eui/es/components/icon/assets/error'
import { icon as help } from '@elastic/eui/es/components/icon/assets/help'
import { icon as copyClipboard } from '@elastic/eui/es/components/icon/assets/copy_clipboard'
import { icon as userAvatar } from '@elastic/eui/es/components/icon/assets/userAvatar'
import { icon as eye } from '@elastic/eui/es/components/icon/assets/eye'
import { icon as editorComment } from '@elastic/eui/es/components/icon/assets/editor_comment'
import { icon as editorLink } from '@elastic/eui/es/components/icon/assets/editor_link'
import { icon as editorCodeBlock } from '@elastic/eui/es/components/icon/assets/editor_code_block'
import { icon as quote } from '@elastic/eui/es/components/icon/assets/quote'
import { icon as editorChecklist } from '@elastic/eui/es/components/icon/assets/editor_checklist'
import { icon as editorOrderedList } from '@elastic/eui/es/components/icon/assets/editor_ordered_list'
import { icon as editorUnorderedList } from '@elastic/eui/es/components/icon/assets/editor_unordered_list'
import { icon as editorItalic } from '@elastic/eui/es/components/icon/assets/editor_italic'
import { icon as editorBold } from '@elastic/eui/es/components/icon/assets/editor_bold'
import { icon as cross } from '@elastic/eui/es/components/icon/assets/cross'


type IconComponentNameType = ValuesType<typeof ICON_TYPES>
type IconComponentCacheType = Partial<Record<IconComponentNameType, unknown>>

const cachedIcons: IconComponentCacheType = {
    popout,
    lock,
    user,
    cross,
    error,
    help,
    userAvatar,
    copyClipboard,
    eye,
    editorComment,
    editorLink,
    editorCodeBlock,
    quote,
    editorChecklist,
    editorOrderedList,
    editorUnorderedList,
    editorItalic,
    editorBold
}

export default appendIconComponentCache(cachedIcons)