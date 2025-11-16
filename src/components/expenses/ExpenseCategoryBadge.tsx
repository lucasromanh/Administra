import { Badge } from '@/components/ui/badge';
import type { ExpenseCategory } from '@/lib/types';
import { getCategoryColor, getCategoryLabel } from '@/lib/expenses';

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
  return (
    <Badge variant="outline" className={getCategoryColor(category)}>
      {getCategoryLabel(category)}
    </Badge>
  );
}
