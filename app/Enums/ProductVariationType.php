<?php

namespace App\Enums;

enum ProductVariationType: string
{
    case Select = "Select";
    case Radio = "Radio";
    case Image = "Image";

    public static function labels(): array
    {
        return [
            self::Select->value => __('Select'),
            self::Radio->value => __('Radio'),
            self::Image->value => __('Image'),
        ];
    }
}
