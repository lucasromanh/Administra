import { Badge } from '@/components/ui/badge';
import type { ExpenseCategory } from '@/lib/types';
import { getCategoryColor } from '@/lib/expenses';

interface ExpenseCategoryBadgeProps {
  category: ExpenseCategory;
}

export function ExpenseCategoryBadge({ category }: ExpenseCategoryBadgeProps) {
  const categoryLabels: Record<ExpenseCategory, string> = {
    oficina: 'Oficina',
    servicios: 'Servicios',
    marketing: 'Marketing',
    personal: 'Personal',
    tecnologia: 'Tecnología',
    otros: 'Otros',
  };

  return (
    <Badge variant="outline" className={getCategoryColor(category)}>
      {categoryLabels[category]}
    </Badge>
  );
}
