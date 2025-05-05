'use client'

import type React from 'react'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Loader2 } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

// Constants
const CATEGORIES = [
    'EVENTS',
    'BUSINESS',
    'ANNOUNCEMENTS',
    'PUBLICATIONS',
    'COURSES',
    'SEMINARS',
    'NEWS',
    'PRODUCTS',
    'PROJECTS',
    'OTHERS',
    'ACADEMICS',
] as const

const CATEGORY_LABELS: Record<string, string> = {
    EVENTS: 'Sự kiện sắp tới',
    BUSINESS: 'Đối tác Doanh nghiệp',
    ANNOUNCEMENTS: 'Thông báo',
    PUBLICATIONS: 'Công bố khoa học',
    COURSES: 'Khóa học',
    SEMINARS: 'Seminar - Workshop',
    NEWS: 'Tin tức',
    BULLETINS: 'Bản tin',
    PRODUCTS: 'Sản phẩm NCKH - CGCN',
    PROJECTS: 'Chương trình - Dự án',
    OTHERS: 'Sách - Giáo trình - Bài giảng',
    ACADEMICS: 'Đối tác học thuật',
}

type FilterValue = {
    filter: string
    value: string
}

export default function AdvancedSearch() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const urlParams = useMemo(() => {
        const language = searchParams.get('language') || 'EN'
        const isDraft = searchParams.get('isDraft') === 'true'
        const isImportant = searchParams.get('isImportant') === 'true'
        const keyword = searchParams.get('keyword') || ''
        const selectedCategories = searchParams.get('categories')?.split(',') ?? []
        const page = Number.parseInt(searchParams.get('page') || '1', 10)

        const filters: FilterValue[] = []
        const filterKeys = searchParams.getAll('filter')
        const valueKeys = searchParams.getAll('value')

        filterKeys.forEach((filter, index) => {
            if (valueKeys[index]) {
                filters.push({
                    filter,
                    value: valueKeys[index].replace(/"/g, ''),
                })
            }
        })

        const statusFilter = filters.find((f) => f.filter === 'status')

        return {
            language,
            isDraft,
            isImportant,
            status: statusFilter?.value,
            searchTerm: keyword,
            filters,
            page,
            categories: selectedCategories,
        }
    }, [searchParams])

    const [language, setLanguage] = useState(urlParams.language)
    const [searchTerm, setSearchTerm] = useState(urlParams.searchTerm)
    const [isDraft, setIsDraft] = useState(urlParams.isDraft)
    const [isImportant, setIsImportant] = useState(urlParams.isImportant)
    const [status, setStatus] = useState(urlParams.status)
    const [selectedCategories, setSelectedCategories] = useState<string[]>(urlParams.categories)
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)

    const [debouncedSearchTerm] = useDebounce(searchTerm, 500)
    const [debouncedIsDraft] = useDebounce(isDraft, 300)
    const [debouncedIsImportant] = useDebounce(isImportant, 300)
    const [debouncedStatus] = useDebounce(status, 300)
    const [debouncedLanguage] = useDebounce(language, 300)
    const [debouncedCategories] = useDebounce(selectedCategories, 300)

    const searchPlaceholder = useMemo(
        () => (language === 'EN' ? 'Search...' : 'Tìm kiếm...'),
        [language]
    )

    const updateURL = useCallback(async () => {
        setIsLoading(true)
        const searchTermChanged = debouncedSearchTerm !== urlParams.searchTerm
        if (searchTermChanged) setIsSearching(true)

        try {
            const params = new URLSearchParams()

            params.set('language', debouncedLanguage)

            if (debouncedIsDraft) params.set('isDraft', 'true')
            if (debouncedIsImportant) params.set('isImportant', 'true')
            if (debouncedSearchTerm) params.set('keyword', debouncedSearchTerm)
            if (debouncedStatus) {
                params.append('filter', 'status')
                params.append('value', debouncedStatus)
            }

            if (debouncedCategories.length > 0) {
                params.set('categories', debouncedCategories.join(','))
            }

            // ✅ Reset page if language changed and not already at page 1
            const shouldResetPage = debouncedLanguage !== urlParams.language && urlParams.page !== 1
            const pageToSet = shouldResetPage ? 1 : urlParams.page
            params.set('page', pageToSet.toString())

            const currentParams = searchParams.toString()
            const newParams = params.toString()
            if (currentParams !== newParams) {
                router.push(`?${newParams}`, { scroll: false })
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false)
                if (searchTermChanged) setIsSearching(false)
            }, 100)
        }
    }, [
        debouncedLanguage,
        debouncedIsDraft,
        debouncedIsImportant,
        debouncedStatus,
        debouncedSearchTerm,
        debouncedCategories,
        router,
        searchParams,
        urlParams.searchTerm,
        urlParams.page,
        urlParams.language,
    ])

    useEffect(() => {
        updateURL()
    }, [
        debouncedLanguage,
        debouncedIsDraft,
        debouncedIsImportant,
        debouncedStatus,
        debouncedSearchTerm,
        debouncedCategories,
        updateURL,
    ])

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault()
        setIsFilterOpen(false)
    }, [])

    const handleLanguageChange = useCallback((lang: string) => {
        setLanguage(lang)
    }, [])

    const categoryCheckboxes = useMemo(() => {
        return CATEGORIES.map((cat) => (
            <div key={cat} className='flex items-center space-x-2'>
                <Checkbox
                    id={`category-${cat}`}
                    checked={selectedCategories.includes(cat)}
                    onCheckedChange={(checked) => {
                        setSelectedCategories((prev) =>
                            checked ? [...prev, cat] : prev.filter((c) => c !== cat)
                        )
                    }}
                />
                <Label htmlFor={`category-${cat}`} className='text-xs'>
                    {language === 'EN' ? cat : CATEGORY_LABELS[cat]}
                </Label>
            </div>
        ))
    }, [selectedCategories, language])

    const statusFilters = useMemo(
        () => (
            <div className='space-y-2'>
                <h3 className='text-sm font-medium'>
                    {language === 'EN' ? 'Status Filters' : 'Trạng thái'}
                </h3>
                <div className='space-y-2'>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='isDraft'
                            checked={isDraft}
                            onCheckedChange={(checked) => setIsDraft(checked === true)}
                        />
                        <Label htmlFor='isDraft' className='text-sm'>
                            {language === 'EN' ? 'Draft' : 'Bản nháp'}
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <Checkbox
                            id='isImportant'
                            checked={isImportant}
                            onCheckedChange={(checked) => setIsImportant(checked === true)}
                        />
                        <Label htmlFor='isImportant' className='text-sm'>
                            {language === 'EN' ? 'Important' : 'Quan trọng'}
                        </Label>
                    </div>
                </div>
            </div>
        ),
        [language, isDraft, isImportant]
    )

    const publicationStatus = useMemo(
        () => (
            <div className='space-y-2'>
                <h3 className='text-sm font-medium'>
                    {language === 'EN' ? 'Publication Status' : 'Trạng thái xuất bản'}
                </h3>
                <RadioGroup value={status} onValueChange={setStatus}>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Achieved' id='achieved' />
                        <Label htmlFor='achieved' className='text-sm'>
                            {language === 'EN' ? 'Achieved' : 'Đã lưu trữ'}
                        </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                        <RadioGroupItem value='Published' id='published' />
                        <Label htmlFor='published' className='text-sm'>
                            {language === 'EN' ? 'Published' : 'Đã xuất bản'}
                        </Label>
                    </div>
                </RadioGroup>
            </div>
        ),
        [language, status]
    )

    const languageButtons = useMemo(
        () => (
            <div className='flex gap-2'>
                <Button
                    variant={language === 'EN' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleLanguageChange('EN')}
                    className='h-7 flex-1 text-xs'
                    disabled={isLoading}
                >
                    English
                </Button>
                <Button
                    variant={language === 'VI' ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => handleLanguageChange('VI')}
                    className='h-7 flex-1 text-xs'
                    disabled={isLoading}
                >
                    Tiếng Việt
                </Button>
            </div>
        ),
        [language, isLoading, handleLanguageChange]
    )

    return (
        <Card className='mx-auto w-full min-w-[300px]'>
            <CardHeader className='p-3'>
                <CardTitle className='text-base'>
                    {language === 'EN' ? ' Search' : 'Tìm Kiếm'}
                </CardTitle>
            </CardHeader>

            <CardContent className='space-y-3 px-3 pb-0'>
                <form onSubmit={handleSearch} className='flex flex-col gap-2'>
                    <div className='relative w-full'>
                        <Search className='absolute left-2.5 top-2.5 size-4 text-muted-foreground' />
                        <Input
                            type='search'
                            placeholder={searchPlaceholder}
                            className='h-9 pl-8 text-sm'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className='flex gap-2'>
                        <Button type='submit' className='h-9 flex-1 text-xs' size='sm'>
                            {isSearching ? (
                                <Loader2 className='mr-1 size-3 animate-spin' />
                            ) : (
                                <Search className='mr-1 size-3' />
                            )}
                            {language === 'EN' ? 'Search' : 'Tìm kiếm'}
                        </Button>

                        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                            <SheetTrigger asChild>
                                <Button variant='outline' className='h-9 gap-1 text-xs' size='sm'>
                                    <Filter className='size-3' />
                                    {language === 'EN' ? 'Filters' : 'Bộ lọc'}
                                </Button>
                            </SheetTrigger>

                            <SheetContent className='w-[280px] sm:w-[300px]'>
                                <SheetHeader>
                                    <SheetTitle>
                                        {language === 'EN' ? 'Search Filters' : 'Bộ Lọc Tìm Kiếm'}
                                    </SheetTitle>
                                    <SheetDescription>
                                        {language === 'EN'
                                            ? 'Customize your search parameters'
                                            : 'Tùy chỉnh các thông số tìm kiếm'}
                                    </SheetDescription>
                                </SheetHeader>

                                <div className='space-y-6 py-4'>
                                    {/* Status Filters */}
                                    {statusFilters}

                                    {/* Publication Status */}
                                    {publicationStatus}

                                    {/* Categories */}
                                    <div className='space-y-2'>
                                        <h3 className='text-sm font-medium'>
                                            {language === 'EN' ? 'Categories' : 'Danh mục'}
                                        </h3>
                                        <div className='grid grid-cols-1 gap-2'>
                                            {categoryCheckboxes}
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </form>
            </CardContent>

            <CardFooter className='flex flex-col items-stretch px-3 pb-2'>
                <Separator className='my-2' />
                <div className='mt-1'>
                    <h3 className='mb-1.5 text-xs font-medium'>
                        {language === 'EN' ? 'Language of the bulletin' : 'Ngôn ngữ của bản tin'}
                    </h3>
                    {languageButtons}
                </div>
            </CardFooter>
        </Card>
    )
}
