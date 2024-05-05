'use client';

import { usePathname, useRouter } from 'next/navigation';

import Editors, { Editor } from '@/lib/editors';

import FilterHelper from '@/helpers/filter';
import PageContextHelper from '@/helpers/pageContext';

import Radio from '@/components/ui/radio';

export default function EditorInput() {
  const router = useRouter();
  const pathname = usePathname();
  const pageContext = PageContextHelper.get(pathname.split('/').slice(1));

  function onChange(editor?: Editor) {
    delete pageContext.filter.editor;
    delete pageContext.filter.page;
    const url = FilterHelper.getURLFromFilter({
      ...pageContext.filter,
      editor,
    });
    router.push(`/${pageContext.sort}/${url}`);
  }

  return (
    <Radio<Editor>
      name="editor"
      value={pageContext.filter.editor}
      onChange={onChange}
      options={[
        { value: undefined, label: 'all' },
        { value: Editors.Vim, label: 'vim' },
        { value: Editors.Neovim, label: 'neovim' },
      ]}
    />
  );
}
