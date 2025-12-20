import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Typography,
} from '@mui/material';

const ResponsiveTable = ({
  columns,
  data,
  renderRow,
  emptyMessage = "Aucune donnée disponible",
  sx = {},
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, ...sx }}>
        {data.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
            {emptyMessage}
          </Typography>
        ) : (
          data.map((row, index) => (
            <Card key={index} elevation={2}>
              <CardContent>
                {columns.map((column) => (
                  <Box
                    key={column.key || column.field}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      py: 1,
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': { borderBottom: 'none' },
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold" color="text.secondary">
                      {column.label}:
                    </Typography>
                    <Typography variant="body2">
                      {column.render
                        ? column.render(row[column.field || column.key], row)
                        : row[column.field || column.key]}
                    </Typography>
                  </Box>
                ))}
                {renderRow && renderRow(row, index)}
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ ...sx }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.key || column.field}
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((column) => (
                  <TableCell key={column.key || column.field}>
                    {column.render
                      ? column.render(row[column.field || column.key], row)
                      : row[column.field || column.key]}
                  </TableCell>
                ))}
                {renderRow && renderRow(row, index)}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ResponsiveTable;









